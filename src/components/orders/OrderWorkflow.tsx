import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { ArrowRight, CheckCircle, Clock } from "lucide-react";

interface WorkflowState {
  name: string;
  description: string;
  next_possible_states: string[];
  required_actions: string[];
}

interface OrderWorkflowProps {
  orderId: string;
  currentState: string;
  onStateChange: (newState: string) => void;
}

export const OrderWorkflow = ({ orderId, currentState, onStateChange }: OrderWorkflowProps) => {
  const [workflowStates, setWorkflowStates] = useState<WorkflowState[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchWorkflowStates = async () => {
      const { data, error } = await supabase
        .from('order_workflow_states')
        .select('*')
        .order('name');

      if (error) {
        console.error('Error fetching workflow states:', error);
        toast.error('Failed to load workflow states');
        return;
      }

      // Transform the data to match WorkflowState type
      const transformedData: WorkflowState[] = data.map(state => ({
        name: state.name,
        description: state.description || '',
        next_possible_states: state.next_possible_states as string[],
        required_actions: state.required_actions as string[]
      }));

      setWorkflowStates(transformedData);
    };

    fetchWorkflowStates();
  }, []);

  const handleStateChange = async (newState: string) => {
    setLoading(true);
    try {
      const { error: historyError } = await supabase
        .from('order_workflow_history')
        .insert({
          order_id: orderId,
          previous_state: currentState,
          new_state: newState,
        });

      if (historyError) throw historyError;

      const { error: orderError } = await supabase
        .from('orders')
        .update({ status: newState })
        .eq('id', orderId);

      if (orderError) throw orderError;

      onStateChange(newState);
      toast.success(`Order status updated to ${newState}`);
    } catch (error) {
      console.error('Error updating order state:', error);
      toast.error('Failed to update order status');
    } finally {
      setLoading(false);
    }
  };

  const currentWorkflowState = workflowStates.find(state => state.name === currentState);
  const nextPossibleStates = currentWorkflowState?.next_possible_states || [];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="w-5 h-5" />
          Order Workflow
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-sm">
            <CheckCircle className="w-4 h-4 text-green-500" />
            Current State: <span className="font-semibold">{currentState}</span>
          </div>

          {currentWorkflowState?.required_actions?.length > 0 && (
            <div className="text-sm text-gray-600">
              <p className="font-medium mb-2">Required Actions:</p>
              <ul className="list-disc list-inside space-y-1">
                {currentWorkflowState.required_actions.map((action, index) => (
                  <li key={index}>{action.replace(/_/g, ' ')}</li>
                ))}
              </ul>
            </div>
          )}

          {nextPossibleStates.length > 0 && (
            <div className="space-y-2">
              <p className="text-sm font-medium">Next Steps:</p>
              <div className="flex flex-wrap gap-2">
                {nextPossibleStates.map((state) => (
                  <Button
                    key={state}
                    variant="outline"
                    size="sm"
                    onClick={() => handleStateChange(state)}
                    disabled={loading}
                    className="flex items-center gap-2"
                  >
                    <ArrowRight className="w-4 h-4" />
                    {state.replace(/_/g, ' ')}
                  </Button>
                ))}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};