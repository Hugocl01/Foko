export interface Notification {
    id: number;
    recipient_id: number;
    actor_id: number;
    type: 'like' | 'comment' | 'follow' | 'message' | 'purchase' | 'report';
    entity_type: 'publication' | 'comment' | 'user' | 'preset';
    entity_id: number;
    reason: string | null;
    status: 'pending' | 'reviewed' | 'resolved';
    read_at: string | null;
    created_at: string;
    updated_at: string;
}
