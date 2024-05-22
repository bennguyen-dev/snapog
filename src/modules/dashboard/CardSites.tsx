"use client";

import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Session } from "next-auth";

interface IProps {
  session: Session | null;
}

export const CardSites = ({ session }: IProps) => {
  const [domain, setDomain] = useState<string>("");

  const handleCreateSite = async () => {
    const userId = session?.user?.id;

    if (!userId) {
      return;
    }

    await fetch(`/api/site/${userId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ domain }),
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="mb-2">Sites</CardTitle>
        <Dialog>
          <DialogTrigger asChild>
            <Button className="w-fit">Add site</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-screen-xs">
            <DialogHeader className="mb-4">
              <DialogTitle>Add new site</DialogTitle>
              <DialogDescription>
                This is the website where you want to use the social images on.
              </DialogDescription>
            </DialogHeader>
            <div className="mb-4 flex flex-col">
              <Label htmlFor="domain" className="mb-2 text-left">
                Domain
              </Label>
              <Input
                id="domain"
                placeholder="www.yoursite.com"
                value={domain}
                onChange={(e) => setDomain(e.target.value)}
              />
            </div>
            <DialogFooter className="sm:justify-end">
              <Button
                type="submit"
                disabled={!domain.trim()}
                onClick={handleCreateSite}
              >
                Add site
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardHeader>
    </Card>
  );
};
