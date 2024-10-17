'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { ArrowRight, Copy, Link, Scissors, Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import axios from 'axios'

export default function URLShortener() {
  const [longUrl, setLongUrl] = useState('')
  const [shortUrl, setShortUrl] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
  
    try {
      const response = await axios.post<{ shortUrl: string }>(
        `http://localhost:3000/shorten`, 
        {
          shortUrl: shortUrl // Replace 'url' with the appropriate key your backend expects.
        }
      );
      
      setShortUrl(response.data.shortUrl);
    } catch (err) {
      setError('Failed to shorten URL. Please try again.');
      console.error('Error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shortUrl)
      .then(() => alert('Copied to clipboard!'))
      .catch(() => alert('Failed to copy. Please try manually.'))
  }

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light')
  }

  if (!mounted) return null

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md mx-auto shadow-lg transition-all duration-300 hover:shadow-xl">
        <CardHeader className="text-center relative">
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-4 top-4"
            onClick={toggleTheme}
          >
            {theme === 'light' ? <Moon className="h-[1.2rem] w-[1.2rem]" /> : <Sun className="h-[1.2rem] w-[1.2rem]" />}
          </Button>
          <CardTitle className="text-3xl font-bold mb-2 text-primary">URL Shortener</CardTitle>
          <CardDescription className="text-lg">Simplify your links in seconds</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="longUrl" className="text-lg font-medium">Long URL</Label>
              <div className="relative">
                <Input
                  id="longUrl"
                  type="url"
                  placeholder="https://example.com/very/long/url"
                  value={longUrl}
                  onChange={(e) => setLongUrl(e.target.value)}
                  required
                  className="pr-10 transition-all duration-300 focus:ring-2 focus:ring-primary"
                />
                <Scissors className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
              </div>
            </div>
            <Button 
              type="submit" 
              className="w-full text-lg py-6 transition-all duration-300 hover:bg-primary/90"
              disabled={isLoading}
            >
              {isLoading ? 'Shortening...' : 'Shorten URL'}
            </Button>
          </form>

          {error && <p className="text-destructive mt-4 text-center">{error}</p>}

          {shortUrl && (
            <div className="mt-6 space-y-2 animate-fade-in">
              <Label htmlFor="shortUrl" className="text-lg font-medium">Shortened URL</Label>
              <div className="flex items-center space-x-2">
                <Input
                  id="shortUrl"
                  type="url"
                  value={shortUrl}
                  readOnly
                  className="flex-grow transition-all duration-300 focus:ring-2 focus:ring-primary"
                />
                <Button size="icon" onClick={copyToClipboard} className="transition-all duration-300 hover:bg-primary/90">
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
              <a
                href={shortUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center text-sm text-primary hover:underline mt-2 transition-all duration-300"
              >
                <Link className="h-4 w-4 mr-1" />
                Open shortened URL
                <ArrowRight className="h-4 w-4 ml-1" />
              </a>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}