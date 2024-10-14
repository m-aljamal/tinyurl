"use client"

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Check, Copy, ExternalLink, MapPin } from 'lucide-react'
import { useCopyToClipboard } from '@/hooks/use-copy-to-clipboard'
 import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { useToast } from '@/hooks/use-toast'

interface LinkData {
  links: {
    id: string;
    originalUrl: string;
    shortCode: string;
    userId: string | null;
    guestId: string | null;
    createdAt: Date;
  };
  analytics: {
    id: string;
    linkId: string | null;
    clickCount: number;
    lastClickedAt: Date | null;
    geoData: {
      city: string;
      country: string;
      latitude: number;
      longitude: number;
    } | null;
  } | null;
}

interface DashboardProps {
  initialUserLinks: LinkData[];
}

export default function Dashboard({ initialUserLinks }: DashboardProps) {
  const [links, setLinks] = useState<LinkData[]>(initialUserLinks)
  const [searchTerm, setSearchTerm] = useState('')
  const { copiedStates, copyToClipboard } = useCopyToClipboard()
  const { toast } = useToast()

  const filteredLinks = links.filter(link => 
    link.links.originalUrl.toLowerCase().includes(searchTerm.toLowerCase()) ||
    link.links.shortCode.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const chartData = links.map(link => ({
    name: link.links.shortCode,
    clicks: link.analytics?.clickCount || 0
  }))

  const handleCopy = (shortCode: string) => {
    const fullUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/${shortCode}`
    copyToClipboard(fullUrl, shortCode, 'short')
    toast({
      title: "Copied to clipboard",
      description: "The shortened URL has been copied to your clipboard.",
    })
  }

  return (
    <div className="max-w-4xl mx-auto py-10">
      <h1 className="text-3xl font-bold mb-8">Your Dashboard</h1>
      
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Click Analytics</CardTitle>
          <CardDescription>Overview of clicks for your shortened links</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={{
            clicks: {
              label: "Clicks",
              color: "hsl(var(--chart-1))",
            },
          }} className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="clicks" fill="var(--color-clicks)" />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Your Links</CardTitle>
          <CardDescription>Manage and analyze your shortened links</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <Input
              placeholder="Search links..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Original URL</TableHead>
                <TableHead>Short Code</TableHead>
                <TableHead>Clicks</TableHead>
                <TableHead>Last Clicked</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredLinks.map((link) => (
                <TableRow key={link.links.id}>
                  <TableCell className="font-medium">{link.links.originalUrl}</TableCell>
                  <TableCell>{link.links.shortCode}</TableCell>
                  <TableCell>{link.analytics?.clickCount || 0}</TableCell>
                  <TableCell>{link.analytics?.lastClickedAt ? new Date(link.analytics.lastClickedAt).toLocaleString() : 'Never'}</TableCell>
                  <TableCell>
                    {link.analytics?.geoData ? (
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button variant="outline" size="icon">
                            <MapPin className="h-4 w-4" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-80">
                          <div className="grid gap-4">
                            <div className="space-y-2">
                              <h4 className="font-medium leading-none">Location Details</h4>
                              <p className="text-sm text-muted-foreground">
                                Last known location of the link visitor
                              </p>
                            </div>
                            <div className="grid gap-2">
                              <div className="grid grid-cols-3 items-center gap-4">
                                <span className="text-sm">City:</span>
                                <span className="col-span-2 text-sm font-medium">{link.analytics.geoData.city}</span>
                              </div>
                              <div className="grid grid-cols-3 items-center gap-4">
                                <span className="text-sm">Country:</span>
                                <span className="col-span-2 text-sm font-medium">{link.analytics.geoData.country}</span>
                              </div>
                              <div className="grid grid-cols-3 items-center gap-4">
                                <span className="text-sm">Coordinates:</span>
                                <span className="col-span-2 text-sm font-medium">
                                  {link.analytics.geoData.latitude.toFixed(4)}, {link.analytics.geoData.longitude.toFixed(4)}
                                </span>
                              </div>
                            </div>
                          </div>
                        </PopoverContent>
                      </Popover>
                    ) : (
                      'N/A'
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleCopy(link.links.shortCode)}
                      >
                        {copiedStates[`${link.links.shortCode}-short`] ? (
                          <Check className="h-4 w-4 text-green-500" />
                        ) : (
                          <Copy className="h-4 w-4" />
                        )}
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        asChild
                      >
                        <a href={`${process.env.NEXT_PUBLIC_BASE_URL}/${link.links.shortCode}`} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="h-4 w-4" />
                        </a>
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}