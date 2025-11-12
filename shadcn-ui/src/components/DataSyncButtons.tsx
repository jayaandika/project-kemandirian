import { Download, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { toast } from 'sonner';
import { useState, useRef } from 'react';
import { downloadAssessments, importAssessments } from '@/lib/dataSync';

export function DataSyncButtons({ onDataChange }: { onDataChange?: () => void }) {
  const [importDialogOpen, setImportDialogOpen] = useState(false);
  const [mergeMode, setMergeMode] = useState<'replace' | 'merge'>('merge');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleExport = () => {
    try {
      const assessments = localStorage.getItem('assessments');
      if (!assessments || JSON.parse(assessments).length === 0) {
        toast.error('Tidak ada data untuk diekspor');
        return;
      }

      downloadAssessments();
      toast.success('Data berhasil diekspor!');
    } catch (error) {
      toast.error('Gagal mengekspor data');
      console.error(error);
    }
  };

  const handleImportClick = () => {
    setImportDialogOpen(true);
  };

  const handleFileSelect = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const text = await file.text();
      const importedCount = importAssessments(text, mergeMode);
      
      toast.success(
        mergeMode === 'replace'
          ? `Data berhasil diimport! Total: ${importedCount} assessment`
          : `Berhasil menambahkan ${importedCount} assessment baru`
      );
      
      setImportDialogOpen(false);
      onDataChange?.();
      
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Gagal mengimport data');
      console.error(error);
    }
  };

  return (
    <>
      <div className="flex gap-2">
        <Button onClick={handleExport} variant="outline" size="sm">
          <Download className="h-4 w-4 mr-2" />
          Export Data
        </Button>
        <Button onClick={handleImportClick} variant="outline" size="sm">
          <Upload className="h-4 w-4 mr-2" />
          Import Data
        </Button>
      </div>

      <Dialog open={importDialogOpen} onOpenChange={setImportDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Import Data Assessment</DialogTitle>
            <DialogDescription>
              Pilih file backup (.json) yang ingin diimport dan tentukan mode import
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Mode Import</Label>
              <RadioGroup value={mergeMode} onValueChange={(value) => setMergeMode(value as 'replace' | 'merge')}>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="merge" id="merge" />
                  <Label htmlFor="merge" className="font-normal cursor-pointer">
                    <div>
                      <div className="font-medium">Gabungkan (Merge)</div>
                      <div className="text-sm text-muted-foreground">
                        Tambahkan data baru ke data yang sudah ada
                      </div>
                    </div>
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="replace" id="replace" />
                  <Label htmlFor="replace" className="font-normal cursor-pointer">
                    <div>
                      <div className="font-medium">Ganti (Replace)</div>
                      <div className="text-sm text-muted-foreground">
                        Hapus semua data lama dan ganti dengan data baru
                      </div>
                    </div>
                  </Label>
                </div>
              </RadioGroup>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setImportDialogOpen(false)}>
              Batal
            </Button>
            <Button onClick={handleFileSelect}>
              Pilih File
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <input
        ref={fileInputRef}
        type="file"
        accept=".json"
        onChange={handleFileChange}
        className="hidden"
      />
    </>
  );
}