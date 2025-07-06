import React, { useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Mic, Camera, FileText, Edit3 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ActionButtonsProps {
  onManualEntry: () => void;
  onAudioCapture: () => void;
  onFileUpload: (file: File) => void;
}

export const ActionButtons: React.FC<ActionButtonsProps> = ({
  onManualEntry,
  onAudioCapture,
  onFileUpload
}) => {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handlePhotoClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onFileUpload(file);
    }
  };

  const handleAudioClick = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      toast({
        title: "Recurso não disponível",
        description: "Seu navegador não suporta reconhecimento de voz.",
        variant: "destructive"
      });
      return;
    }
    onAudioCapture();
  };

  return (
    <Card>
      <CardContent className="p-6">
        <div className="grid grid-cols-2 gap-4">
          <Button
            variant="outline"
            className="h-24 flex-col gap-2"
            onClick={handleAudioClick}
          >
            <Mic className="h-8 w-8" />
            <span>Áudio</span>
          </Button>

          <Button
            variant="outline"
            className="h-24 flex-col gap-2"
            onClick={handlePhotoClick}
          >
            <Camera className="h-8 w-8" />
            <span>Foto</span>
          </Button>

          <Button
            variant="outline"
            className="h-24 flex-col gap-2"
            onClick={handlePhotoClick}
          >
            <FileText className="h-8 w-8" />
            <span>Arquivo</span>
          </Button>

          <Button
            variant="outline"
            className="h-24 flex-col gap-2"
            onClick={onManualEntry}
          >
            <Edit3 className="h-8 w-8" />
            <span>Manual</span>
          </Button>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*,.pdf,.doc,.docx"
          onChange={handleFileChange}
          className="hidden"
        />
      </CardContent>
    </Card>
  );
};