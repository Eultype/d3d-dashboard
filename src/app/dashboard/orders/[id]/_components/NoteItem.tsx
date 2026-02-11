"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { updateOrderNote } from "@/actions/order";
import { toast } from "sonner";
import { Pencil, Check, X, Loader2 } from "lucide-react";
import { formatDateFR } from "@/lib/utils/dates";

type NoteItemProps = {
    note: {
        id: string;
        content: string;
        createdAt: Date;
        user: {
            email: string;
        };
    };
};

export function NoteItem({ note }: NoteItemProps) {
    const [isEditing, setIsEditing] = useState(false);
    const [content, setContent] = useState(note.content);
    const [isLoading, setIsLoading] = useState(false);

    const handleSave = async () => {
        if (content.trim() === "") {
            toast.error("Le contenu ne peut pas être vide.");
            return;
        }

        setIsLoading(true);
        try {
            const result = await updateOrderNote(note.id, content);
            if (result.success) {
                toast.success("Note mise à jour avec succès.");
                setIsEditing(false);
            } else {
                toast.error(result.message || "Erreur lors de la mise à jour.");
            }
        } catch (error) {
            toast.error("Une erreur est survenue.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleCancel = () => {
        setContent(note.content);
        setIsEditing(false);
    };

    return (
        <div className="text-sm group relative rounded-xl border border-white/10 hover:bg-white/2 p-3 -mx-2 transition-colors">
            {isEditing ? (
                <div className="space-y-2">
                    <Textarea
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        className="min-h-20"
                        disabled={isLoading}
                    />
                    <div className="flex justify-end gap-2">
                        <Button
                            size="sm"
                            variant="ghost"
                            onClick={handleCancel}
                            disabled={isLoading}
                            className="h-8 px-2"
                        >
                            <X className="h-4 w-4 mr-1" />
                            Annuler
                        </Button>
                        <Button
                            size="sm"
                            onClick={handleSave}
                            disabled={isLoading}
                            className="h-8 px-2"
                        >
                            {isLoading ? (
                                <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                            ) : (
                                <Check className="h-4 w-4 mr-1" />
                            )}
                            Enregistrer
                        </Button>
                    </div>
                </div>
            ) : (
                <>
                    <div className="pr-8">
                        <p className="whitespace-pre-wrap">{note.content}</p>
                    </div>
                    <div className="mt-1 flex items-center justify-between">
                        <p className="text-xs text-muted-foreground">
                            Par {note.user.email} • {formatDateFR(new Date(note.createdAt))}
                        </p>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity absolute top-2 right-2"
                            onClick={() => setIsEditing(true)}
                        >
                            <Pencil className="h-3 w-3" />
                            <span className="sr-only">Modifier</span>
                        </Button>
                    </div>
                </>
            )}
        </div>
    );
}
