import React, { memo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useTheme } from 'next-themes'
import { Switch } from '@/components/ui/switch'
import { Palette, Sun, Moon, Monitor } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export const AppearanceView = memo(() => {
  const { theme, setTheme } = useTheme()

  const themes = [
    { id: 'light', label: 'Light', icon: Sun, desc: 'Clean bright interface' },
    { id: 'dark', label: 'Dark', icon: Moon, desc: 'Easy on the eyes' },
    { id: 'system', label: 'System', icon: Monitor, desc: 'Follow OS setting' },
  ]

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Appearance</h2>
        <p className="text-muted-foreground text-sm mt-1">Customize the look and feel of your admin panel</p>
      </div>

      {/* Theme Selector */}
      <Card className="bg-card/50 backdrop-blur-sm border-border/50">
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Palette className="w-4 h-4 text-purple-500" />
            Theme
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {themes.map(t => (
              <button
                key={t.id}
                onClick={() => setTheme(t.id)}
                className={cn(
                  "flex items-center gap-3 p-4 rounded-xl border-2 transition-all",
                  theme === t.id
                    ? "border-primary bg-primary/5"
                    : "border-border/50 hover:border-border"
                )}
              >
                <div className={cn(
                  "h-10 w-10 rounded-lg flex items-center justify-center",
                  theme === t.id ? "bg-primary/10" : "bg-muted"
                )}>
                  <t.icon className={cn("w-5 h-5", theme === t.id ? "text-primary" : "text-muted-foreground")} />
                </div>
                <div className="text-left">
                  <p className="text-sm font-semibold">{t.label}</p>
                  <p className="text-xs text-muted-foreground">{t.desc}</p>
                </div>
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Color Preview */}
      <Card className="bg-card/50 backdrop-blur-sm border-border/50">
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Color Palette Preview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
            {[
              { name: 'Primary', cls: 'bg-primary' },
              { name: 'Secondary', cls: 'bg-secondary' },
              { name: 'Accent', cls: 'bg-accent' },
              { name: 'Muted', cls: 'bg-muted' },
              { name: 'Background', cls: 'bg-background border border-border' },
              { name: 'Card', cls: 'bg-card border border-border' },
              { name: 'Destructive', cls: 'bg-destructive' },
              { name: 'Foreground', cls: 'bg-foreground' },
            ].map(color => (
              <div key={color.name} className="flex flex-col items-center gap-1">
                <div className={cn("w-10 h-10 rounded-lg", color.cls)} />
                <span className="text-[10px] text-muted-foreground">{color.name}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
})

AppearanceView.displayName = 'AppearanceView'
