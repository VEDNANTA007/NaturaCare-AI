import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Pill, Plus, Clock, Check, Calendar, Trash2, LogOut, User } from 'lucide-react';
import { toast } from 'sonner';
import { format, parseISO } from 'date-fns';

interface Medication {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  time_of_day: string[];
  notes: string | null;
  created_at: string;
}

interface MedicationLog {
  id: string;
  medication_id: string;
  taken: boolean;
  scheduled_time: string;
  taken_at: string | null;
}

const MedicationTracker = () => {
  const { user, loading: authLoading, signOut } = useAuth();
  const navigate = useNavigate();
  const [medications, setMedications] = useState<Medication[]>([]);
  const [logs, setLogs] = useState<MedicationLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  
  // Form state
  const [name, setName] = useState('');
  const [dosage, setDosage] = useState('');
  const [frequency, setFrequency] = useState('daily');
  const [timeOfDay, setTimeOfDay] = useState<string[]>(['morning']);
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth');
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (user) {
      fetchMedications();
      fetchTodayLogs();
    }
  }, [user]);

  const fetchMedications = async () => {
    const { data, error } = await (supabase as any)
      .from('medications')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      toast.error('Failed to load medications');
      console.error(error);
    } else {
      setMedications((data as Medication[]) || []);
    }
    setLoading(false);
  };

  const fetchTodayLogs = async () => {
    const today = format(new Date(), 'yyyy-MM-dd');
    const { data, error } = await (supabase as any)
      .from('medication_logs')
      .select('*')
      .gte('scheduled_time', `${today}T00:00:00`)
      .lte('scheduled_time', `${today}T23:59:59`);

    if (error) {
      console.error('Failed to load logs:', error);
    } else {
      setLogs((data as MedicationLog[]) || []);
    }
  };

  const addMedication = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const { data, error } = await (supabase as any)
      .from('medications')
      .insert({
        user_id: user!.id,
        name,
        dosage,
        frequency,
        time_of_day: timeOfDay,
        notes: notes || null,
      })
      .select()
      .single();

    if (error) {
      toast.error('Failed to add medication');
      console.error(error);
    } else if (data) {
      const newMedication = data as Medication;
      setMedications([newMedication, ...medications]);
      createTodayLogs(newMedication);
      toast.success('Medication added!');
      setDialogOpen(false);
      resetForm();
    }
  };

  const createTodayLogs = async (medication: Medication) => {
    const today = format(new Date(), 'yyyy-MM-dd');
    const timeMap: Record<string, string> = {
      morning: '08:00:00',
      afternoon: '12:00:00',
      evening: '18:00:00',
      night: '21:00:00',
    };

    const logsToCreate = medication.time_of_day.map((time) => ({
      user_id: user!.id,
      medication_id: medication.id,
      scheduled_time: `${today}T${timeMap[time]}`,
      taken: false,
    }));

    const { data, error } = await (supabase as any)
      .from('medication_logs')
      .insert(logsToCreate)
      .select();

    if (!error && data) {
      setLogs([...logs, ...(data as MedicationLog[])]);
    }
  };

  const toggleMedicationTaken = async (log: MedicationLog) => {
    const newTaken = !log.taken;
    const { error } = await (supabase as any)
      .from('medication_logs')
      .update({
        taken: newTaken,
        taken_at: newTaken ? new Date().toISOString() : null,
      })
      .eq('id', log.id);

    if (error) {
      toast.error('Failed to update');
    } else {
      setLogs(logs.map((l) => 
        l.id === log.id 
          ? { ...l, taken: newTaken, taken_at: newTaken ? new Date().toISOString() : null }
          : l
      ));
      toast.success(newTaken ? 'Marked as taken!' : 'Marked as not taken');
    }
  };

  const deleteMedication = async (id: string) => {
    const { error } = await (supabase as any)
      .from('medications')
      .delete()
      .eq('id', id);

    if (error) {
      toast.error('Failed to delete medication');
    } else {
      setMedications(medications.filter((m) => m.id !== id));
      setLogs(logs.filter((l) => l.medication_id !== id));
      toast.success('Medication deleted');
    }
  };

  const resetForm = () => {
    setName('');
    setDosage('');
    setFrequency('daily');
    setTimeOfDay(['morning']);
    setNotes('');
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const getMedicationLogsForToday = (medicationId: string) => {
    return logs.filter((log) => log.medication_id === medicationId);
  };

  if (authLoading || loading) {
    return (
      <Layout>
        <div className="container py-12 text-center">
          <div className="animate-pulse">Loading...</div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container py-8 max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Medication Tracker</h1>
            <p className="text-muted-foreground mt-1">
              Track your daily medications and stay on schedule
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <User className="w-4 h-4" />
              <span className="hidden sm:inline">{user?.email}</span>
            </div>
            <Button variant="outline" size="sm" onClick={handleSignOut}>
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>

        {/* Today's Summary */}
        <Card className="mb-8 bg-primary/5 border-primary/20">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold">Today's Progress</h2>
                  <p className="text-muted-foreground">
                    {format(new Date(), 'EEEE, MMMM d, yyyy')}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-primary">
                  {logs.filter((l) => l.taken).length}/{logs.length}
                </div>
                <p className="text-sm text-muted-foreground">doses taken</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Add Medication Button */}
        <div className="flex justify-end mb-6">
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Add Medication
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Medication</DialogTitle>
                <DialogDescription>
                  Enter the details of your medication to start tracking.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={addMedication} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Medication Name</Label>
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g., Vitamin D"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dosage">Dosage</Label>
                  <Input
                    id="dosage"
                    value={dosage}
                    onChange={(e) => setDosage(e.target.value)}
                    placeholder="e.g., 1000 IU"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="frequency">Frequency</Label>
                  <Select value={frequency} onValueChange={setFrequency}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="daily">Daily</SelectItem>
                      <SelectItem value="twice_daily">Twice Daily</SelectItem>
                      <SelectItem value="weekly">Weekly</SelectItem>
                      <SelectItem value="as_needed">As Needed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Time of Day</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {['morning', 'afternoon', 'evening', 'night'].map((time) => (
                      <div key={time} className="flex items-center space-x-2">
                        <Checkbox
                          id={time}
                          checked={timeOfDay.includes(time)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setTimeOfDay([...timeOfDay, time]);
                            } else {
                              setTimeOfDay(timeOfDay.filter((t) => t !== time));
                            }
                          }}
                        />
                        <Label htmlFor={time} className="text-sm capitalize">
                          {time}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="notes">Notes (optional)</Label>
                  <Input
                    id="notes"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="e.g., Take with food"
                  />
                </div>
                <Button type="submit" className="w-full">
                  Add Medication
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Medications List */}
        {medications.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <Pill className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">No medications yet</h3>
              <p className="text-muted-foreground mb-4">
                Add your first medication to start tracking
              </p>
              <Button onClick={() => setDialogOpen(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Add Medication
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {medications.map((medication) => {
              const todayLogs = getMedicationLogsForToday(medication.id);
              const allTaken = todayLogs.length > 0 && todayLogs.every((l) => l.taken);
              
              return (
                <Card key={medication.id} className={allTaken ? 'border-[hsl(var(--success-green))]/50' : ''}>
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          allTaken ? 'bg-[hsl(var(--success-green))]/10' : 'bg-primary/10'
                        }`}>
                          {allTaken ? (
                            <Check className="w-5 h-5 text-[hsl(var(--success-green))]" />
                          ) : (
                            <Pill className="w-5 h-5 text-primary" />
                          )}
                        </div>
                        <div>
                          <CardTitle className="text-lg">{medication.name}</CardTitle>
                          <CardDescription>{medication.dosage}</CardDescription>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-muted-foreground hover:text-destructive"
                        onClick={() => deleteMedication(medication.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2 mb-4">
                      <Badge variant="secondary" className="capitalize">
                        {medication.frequency.replace('_', ' ')}
                      </Badge>
                      {medication.time_of_day.map((time) => (
                        <Badge key={time} variant="outline" className="capitalize">
                          {time}
                        </Badge>
                      ))}
                    </div>
                    
                    {medication.notes && (
                      <p className="text-sm text-muted-foreground mb-4">
                        📝 {medication.notes}
                      </p>
                    )}

                    {/* Today's doses */}
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        Today's Doses
                      </h4>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                        {todayLogs.map((log) => {
                          const time = parseISO(log.scheduled_time);
                          const hour = time.getHours();
                          const timeLabel = 
                            hour < 10 ? 'Morning' :
                            hour < 14 ? 'Afternoon' :
                            hour < 20 ? 'Evening' : 'Night';
                          
                          return (
                            <Button
                              key={log.id}
                              variant={log.taken ? 'default' : 'outline'}
                              size="sm"
                              className={`justify-start ${log.taken ? 'bg-[hsl(var(--success-green))] hover:bg-[hsl(var(--success-green))]/90' : ''}`}
                              onClick={() => toggleMedicationTaken(log)}
                            >
                              {log.taken ? (
                                <Check className="w-4 h-4 mr-2" />
                              ) : (
                                <Clock className="w-4 h-4 mr-2" />
                              )}
                              {timeLabel}
                            </Button>
                          );
                        })}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default MedicationTracker;
