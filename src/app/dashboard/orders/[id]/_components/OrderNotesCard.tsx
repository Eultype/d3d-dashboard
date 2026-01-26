import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDateFR } from "@/lib/utils/dates";

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
                            <div key={note.id} className="text-sm">
                                <p>{note.content}</p>
                                <p className="text-xs text-muted-foreground">
                                    Par {note.user.email} • {formatDateFR(new Date(note.createdAt))}
                                </p>
                            </div>
                        ))}
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
