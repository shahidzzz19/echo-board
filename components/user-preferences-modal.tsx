'use client';

import { Grid, List } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useAppSelector, useAppDispatch } from '@/lib/hooks';
import { updatePreferences } from '@/lib/slices/userSlice';

interface UserPreferencesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function UserPreferencesModal({ isOpen, onClose }: UserPreferencesModalProps) {
  const dispatch = useAppDispatch();
  const { preferences } = useAppSelector((state) => state.user);

  const [localPreferences, setLocalPreferences] = useState(preferences);

  const categories = [
    'technology',
    'sports',
    'finance',
    'entertainment',
    'health',
    'science',
    'politics',
    'business',
  ];

  const handleCategoryChange = (category: string, checked: boolean) => {
    setLocalPreferences((prev) => ({
      ...prev,
      categories: checked
        ? [...prev.categories, category]
        : prev.categories.filter((c) => c !== category),
    }));
  };

  const handleSave = () => {
    dispatch(updatePreferences(localPreferences));
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md" aria-describedby="preferences-description">
        <DialogHeader>
          <DialogTitle>User Preferences</DialogTitle>
          <p id="preferences-description" className="text-sm text-muted-foreground">
            Customize your content dashboard experience by selecting your preferred categories and
            layout options.
          </p>
        </DialogHeader>

        <div className="space-y-6">
          <div>
            <Label className="text-base font-medium">Content Categories</Label>
            <p className="text-sm text-muted-foreground mb-3">
              Select categories you're interested in
            </p>
            <div className="grid grid-cols-2 gap-3">
              {categories.map((category) => (
                <div key={category} className="flex items-center space-x-2">
                  <Checkbox
                    id={category}
                    checked={localPreferences.categories.includes(category)}
                    onCheckedChange={(checked) =>
                      handleCategoryChange(category, checked as boolean)
                    }
                  />
                  <Label
                    htmlFor={category}
                    className="text-sm font-normal capitalize cursor-pointer"
                  >
                    {category}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          <div>
            <Label className="text-base font-medium">Layout Preference</Label>
            <p className="text-sm text-muted-foreground mb-3">
              Choose how you want to view content
            </p>
            <RadioGroup
              value={localPreferences.layout}
              onValueChange={(value) =>
                setLocalPreferences((prev) => ({ ...prev, layout: value as 'grid' | 'list' }))
              }
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="grid" id="grid" />
                <Label htmlFor="grid" className="flex items-center gap-2 cursor-pointer">
                  <Grid className="h-4 w-4" />
                  Grid View
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="list" id="list" />
                <Label htmlFor="list" className="flex items-center gap-2 cursor-pointer">
                  <List className="h-4 w-4" />
                  List View
                </Label>
              </div>
            </RadioGroup>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleSave}>Save Preferences</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
