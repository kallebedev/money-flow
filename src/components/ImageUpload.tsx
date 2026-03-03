import React, { useState, useCallback } from "react";
import Cropper from "react-easy-crop";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Slider } from "@/components/ui/slider";
import getCroppedImg from "@/lib/imageUtils";
import { Camera, Upload, X } from "lucide-react";

interface ImageUploadProps {
    onUpload: (blob: Blob) => Promise<void>;
    currentImageUrl?: string;
    loading?: boolean;
}

export function ImageUpload({ onUpload, currentImageUrl, loading }: ImageUploadProps) {
    const [image, setImage] = useState<string | null>(null);
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const onCropComplete = useCallback((_croppedArea: any, croppedAreaPixels: any) => {
        setCroppedAreaPixels(croppedAreaPixels);
    }, []);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const reader = new FileReader();
            reader.addEventListener("load", () => {
                setImage(reader.result as string);
                setIsDialogOpen(true);
            });
            reader.readAsDataURL(e.target.files[0]);
        }
    };

    const handleCropSave = async () => {
        try {
            if (image && croppedAreaPixels) {
                const croppedImageBlob = await getCroppedImg(image, croppedAreaPixels);
                if (croppedImageBlob) {
                    await onUpload(croppedImageBlob);
                    setIsDialogOpen(false);
                    setImage(null);
                }
            }
        } catch (e) {
            console.error(e);
        }
    };

    return (
        <div className="relative group overflow-hidden rounded-full h-24 w-24">
            <img
                src={currentImageUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=placeholder`}
                alt="Avatar"
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
            />

            <label
                htmlFor="avatar-upload"
                className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer text-white"
            >
                {loading ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                    <>
                        <Camera className="h-6 w-6 mb-1" />
                        <span className="text-[10px] font-medium">Trocar</span>
                    </>
                )}
                <input
                    id="avatar-upload"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleFileChange}
                    disabled={loading}
                />
            </label>

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                        <DialogTitle>Redimensionar Foto</DialogTitle>
                    </DialogHeader>
                    <div className="relative h-[300px] w-full bg-slate-100 rounded-md overflow-hidden">
                        {image && (
                            <Cropper
                                image={image}
                                crop={crop}
                                zoom={zoom}
                                aspect={1}
                                onCropChange={setCrop}
                                onCropComplete={onCropComplete}
                                onZoomChange={setZoom}
                                cropShape="round"
                                showGrid={false}
                            />
                        )}
                    </div>
                    <div className="py-4 space-y-2">
                        <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">Zoom</span>
                            <span className="font-medium text-primary">{zoom.toFixed(1)}x</span>
                        </div>
                        <Slider
                            value={[zoom]}
                            min={1}
                            max={3}
                            step={0.1}
                            onValueChange={(value) => setZoom(value[0])}
                            className="py-4"
                        />
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                            Cancelar
                        </Button>
                        <Button onClick={handleCropSave} disabled={loading}>
                            {loading ? "Salvando..." : "Salvar Foto"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
