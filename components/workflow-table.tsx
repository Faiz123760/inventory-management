import React, { useState } from "react";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { ShieldCheck, Lock } from "lucide-react";
import { EditCredentialDialog } from "@/components/edit-credential-dialog";

export interface WorkflowCategory {
  title: string;
  description: string;
  workflows: string[];
  credentials: {
    usernameKey: string;
    passwordKey: string;
    urls: {
      primary: string;
      analytics?: string;
      showroom?: string;
    };
  };
}

interface WorkflowTableProps {
  category: WorkflowCategory;
}

export function WorkflowTable({ category }: WorkflowTableProps) {
  const [editDialog, setEditDialog] = useState<{
    open: boolean;
    key: string;
    value: string;
    type: 'username' | 'password' | 'url';
  }>({ open: false, key: '', value: '', type: 'username' });

  const CredentialField = ({ label, keyValue }: { label: string; keyValue: string }) => (
    <div className="flex flex-col gap-1">
      <span className="text-xs font-medium text-muted-foreground">{label}</span>
      <div className="flex items-center gap-2 rounded-xl border bg-background px-3 py-2">
        <code className="text-xs font-mono flex-1">{keyValue}</code>
        <Badge variant="secondary" className="text-[10px] uppercase tracking-wide">Locked</Badge>
      </div>
    </div>
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {category.title}
          <Badge variant="outline">{category.workflows.length} workflows</Badge>
        </CardTitle>
        <CardDescription>{category.description}</CardDescription>

        <Separator className="my-4" />

        <div className="space-y-4 bg-muted/30 p-4 rounded-lg border">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-emerald-600" />
            <h4 className="text-sm font-semibold">Authentication & Configuration</h4>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-3">
              <h5 className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Authentication</h5>
              <div className="space-y-2">
                <CredentialField label="Username Key" keyValue={category.credentials.usernameKey} />
                <CredentialField label="Password Key" keyValue={category.credentials.passwordKey} />
              </div>
            </div>

            <div className="space-y-3">
              <h5 className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Primary Configuration</h5>
              <div className="space-y-2">
                <CredentialField label="Main URL" keyValue={category.credentials.urls.primary} />
                {category.credentials.urls.analytics && (
                  <CredentialField label="Analytics URL" keyValue={category.credentials.urls.analytics} />
                )}
                {category.credentials.urls.showroom && (
                  <CredentialField label="Showroom URL" keyValue={category.credentials.urls.showroom} />
                )}
              </div>
            </div>
          </div>
        </div>
      </CardHeader>

      <div className="px-6 pb-6">
        <div className="rounded-xl border bg-muted/20 p-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-2 font-medium text-slate-900">
            <Lock className="h-4 w-4 text-amber-600" />
            Workflow editing is disabled in static mode.
          </div>
          <p className="mt-2">The workflow list remains as a reference-only configuration panel.</p>
          <Button variant="outline" className="mt-4" onClick={() => setEditDialog({ open: true, key: category.credentials.usernameKey, value: category.credentials.usernameKey, type: 'username' })}>
            View credential details
          </Button>
        </div>
      </div>

      <EditCredentialDialog
        open={editDialog.open}
        onOpenChange={(open) => setEditDialog(prev => ({ ...prev, open }))}
        keyValue={editDialog.key}
        currentValue={editDialog.value}
        type={editDialog.type}
        onSave={async () => undefined}
      />
    </Card>
  );
}