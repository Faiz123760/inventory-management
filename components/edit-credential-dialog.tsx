"use client"

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { BadgeCheck } from "lucide-react";

interface EditCredentialDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  keyValue: string;
  currentValue: string;
  type: 'username' | 'password' | 'url';
  onSave: (key: string, value: string, type: 'username' | 'password' | 'url') => Promise<void>;
}

export function EditCredentialDialog({
  open,
  onOpenChange,
    } catch (error) {
      console.error('Failed to update credential:', error);
    } finally {
      setLoading(false);
    }
  };

  const getTypeLabel = () => {
    switch (type) {
      case 'username': return 'Username';
      case 'password': return 'Password';
      case 'url': return 'URL';
      default: return 'Value';
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-105">
        <DialogHeader>
          <DialogTitle>Edit {getTypeLabel()}</DialogTitle>
          <DialogDescription>
            Static mode only. The credential editor is read-only now.
          </DialogDescription>
        </DialogHeader>
        <div className="flex items-center gap-2 rounded-xl border bg-muted/20 p-3 text-sm text-muted-foreground">
          <BadgeCheck className="h-4 w-4 text-emerald-600" />
          Value for {keyValue} is displayed for reference only.
        </div>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="value" className="text-right">
              {getTypeLabel()}
            </Label>
            <Input
              id="value"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              className="col-span-3"
              type={type === 'password' ? 'password' : 'text'}
              readOnly
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}