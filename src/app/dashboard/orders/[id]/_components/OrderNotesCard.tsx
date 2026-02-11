import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { NoteItem } from "./NoteItem";

type OrderNotesCardProps = {
    notes: {
        id: string;
        content: string;
        createdAt: Date;
        user: {
            email: string;
        };
    }[];
};

export function OrderNotesCard({ notes }: OrderNotesCardProps) {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-base">Notes</CardTitle>
                <p className="text-sm text-muted-foreground">Notes internes sur la commande</p>
            </CardHeader>
            <CardContent>
                {notes.length === 0 ? (
                    <p className="text-sm text-muted-foreground italic">Aucune note.</p>
                ) : (
                    <div className="space-y-4">
                        {notes.map((note) => (
                            <NoteItem key={note.id} note={note} />
                        ))}
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
