import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { isImageUrl } from "@/lib/strings";
import Image from "next/image";
import { Eye, Download, FileText } from "lucide-react";

type OrderFilesCardProps = {
    files: {
        id: string;
        url: string;
        filename: string;
    }[];
};

export function OrderFilesCard({ files }: OrderFilesCardProps) {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-base">Fichiers</CardTitle>
                <p className="text-sm text-muted-foreground">Fichiers joints à la commande</p>
            </CardHeader>
            <CardContent>
                {files.length === 0 ? (
                    <p className="text-sm text-muted-foreground italic">Aucun fichier.</p>
                ) : (
                    <div className="space-y-3">
                        {files.map((file) => {
                            const isImg = isImageUrl(file.url);

                            return (
                                <div
                                    key={file.id}
                                    className="group flex items-center justify-between gap-3 rounded-xl border p-3 hover:bg-muted/30 transition"
                                >
                                    {/* Left */}
                                    <div className="flex items-center gap-3 min-w-0">
                                        <div className="relative h-9 w-9 overflow-hidden rounded-lg border bg-muted/30">
                                            {isImg ? (
                                                <Image
                                                    src={file.url}
                                                    alt={file.filename}
                                                    fill
                                                    sizes="36px"
                                                    className="object-cover"
                                                />
                                            ) : (
                                                <div className="flex h-full w-full items-center justify-center text-muted-foreground">
                                                    <FileText className="h-4 w-4" />
                                                </div>
                                            )}
                                        </div>

                                        <div className="min-w-0">
                                            <p className="text-sm font-medium truncate">{file.filename}</p>
                                            <p className="text-xs text-muted-foreground">{isImg ? "Image" : "Document"}</p>
                                        </div>
                                    </div>

                                    {/* Actions */}
                                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition">
                                        <a
                                            href={file.url}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="inline-flex h-8 w-8 items-center justify-center rounded-lg hover:bg-muted"
                                            title="Voir"
                                        >
                                            <Eye className="h-4 w-4" />
                                        </a>

                                        <a
                                            href={file.url}
                                            download
                                            className="inline-flex h-8 w-8 items-center justify-center rounded-lg hover:bg-muted"
                                            title="Télécharger"
                                        >
                                            <Download className="h-4 w-4" />
                                        </a>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
