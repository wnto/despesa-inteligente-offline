import React, { useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Mic, Camera, FileText, Edit3 } from 'lucide-react';
import { WhisperSpeech } from 'capacitor-whisper-speech';

interface ActionButtonsProps {
  onManualEntry: () => void;
  onFileUpload: (file: File) => void;
}

export const ActionButtons: React.FC<ActionButtonsProps> = ({
  onManualEntry,
  onFileUpload
}) => {
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

  const handleAudioClick = async () => {
    console.log('handleAudioClick: Ação de áudio iniciada.');
    try {
      console.log('handleAudioClick: Chamando WhisperSpeech.record()...');
      const result = await WhisperSpeech.record();
      console.log('handleAudioClick: SUCESSO! Plugin retornou:', JSON.stringify(result));
    } catch (error) {
      console.error('handleAudioClick: ERRO! Ocorreu uma exceção:', error);
    }
    console.log('handleAudioClick: Ação de áudio finalizada.');
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