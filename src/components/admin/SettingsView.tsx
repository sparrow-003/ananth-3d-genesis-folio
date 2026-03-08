import React, { memo, useState, useCallback } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import { Settings, Shield, Globe, Bell, Database, CheckCircle2 } from 'lucide-react'
import { supabase } from '@/integrations/supabase/client'
import { toast } from 'sonner'

interface SettingsViewProps {
  onLogout: () => void
}

export const SettingsView = memo(({ onLogout }: SettingsViewProps) => {
  const [passwordData, setPasswordData] = useState({ current: '', new: '', confirm: '' })
  const [isChangingPassword, setIsChangingPassword] = useState(false)

  const handleChangePassword = useCallback(async () => {
    if (passwordData.new !== passwordData.confirm) {
      toast.error('New passwords do not match')
      return
    }
    if (passwordData.new.length < 6) {
      toast.error('Password must be at least 6 characters')
      return
    }
    setIsChangingPassword(true)
    try {
      const { error } = await supabase.auth.updateUser({ password: passwordData.new })
      if (error) throw error
      toast.success('Password updated successfully')
      setPasswordData({ current: '', new: '', confirm: '' })
    } catch (error: any) {
      toast.error('Failed to update password: ' + error.message)
    } finally {
      setIsChangingPassword(false)
    }
  }, [passwordData])

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Settings</h2>
        <p className="text-muted-foreground text-sm mt-1">Manage your admin account and preferences</p>
      </div>

      {/* Security */}
      <Card className="bg-card/50 backdrop-blur-sm border-border/50">
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Shield className="w-4 h-4 text-green-500" />
            Security
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-xs font-medium text-muted-foreground">New Password</label>
            <Input
              type="password"
              value={passwordData.new}
              onChange={e => setPasswordData(prev => ({ ...prev, new: e.target.value }))}
              placeholder="Enter new password"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-medium text-muted-foreground">Confirm New Password</label>
            <Input
              type="password"
              value={passwordData.confirm}
              onChange={e => setPasswordData(prev => ({ ...prev, confirm: e.target.value }))}
              placeholder="Confirm new password"
            />
          </div>
          <Button
            onClick={handleChangePassword}
            disabled={isChangingPassword || !passwordData.new || !passwordData.confirm}
            size="sm"
          >
            {isChangingPassword ? 'Updating...' : 'Update Password'}
          </Button>
        </CardContent>
      </Card>

      {/* System Info */}
      <Card className="bg-card/50 backdrop-blur-sm border-border/50">
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Database className="w-4 h-4 text-blue-500" />
            System Info
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {[
            { label: 'Platform', value: 'Genesis Blog Admin' },
            { label: 'Backend', value: 'Supabase' },
            { label: 'Auth', value: 'JWT + RBAC (admin role)' },
            { label: 'Edge Functions', value: 'admin-blog' },
            { label: 'RLS', value: 'Enabled on all tables' },
          ].map(item => (
            <div key={item.label} className="flex items-center justify-between py-1.5 border-b border-border/30 last:border-0">
              <span className="text-sm text-muted-foreground">{item.label}</span>
              <span className="text-sm font-medium flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3 text-green-500" />
                {item.value}
              </span>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Danger Zone */}
      <Card className="bg-card/50 backdrop-blur-sm border-destructive/30">
        <CardHeader className="pb-3">
          <CardTitle className="text-base text-destructive">Danger Zone</CardTitle>
        </CardHeader>
        <CardContent>
          <Button variant="destructive" onClick={onLogout}>
            Sign Out
          </Button>
        </CardContent>
      </Card>
    </div>
  )
})

SettingsView.displayName = 'SettingsView'
