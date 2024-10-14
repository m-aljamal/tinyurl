import { useState } from 'react';
import { useToast } from "@/hooks/use-toast";

export function useCopyToClipboard() {
  const [copiedStates, setCopiedStates] = useState<{ [key: string]: boolean }>({});
  const { toast } = useToast();

  const copyToClipboard = async (text: string, id: string, type: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedStates(prev => ({ ...prev, [`${id}-${type}`]: true }));
      toast({
        title: "Copied to clipboard",
        description: `The ${type} URL has been copied to your clipboard.`,
      });
      setTimeout(() => {
        setCopiedStates(prev => ({ ...prev, [`${id}-${type}`]: false }));
      }, 2000);
    } catch (err) {
      console.error("Failed to copy: ", err);
      toast({
        title: "Copy failed",
        description: "Failed to copy the URL. Please try again.",
        variant: "destructive",
      });
    }
  };

  return { copiedStates, copyToClipboard };
}