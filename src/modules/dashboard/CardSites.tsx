"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import { useCallApi } from "@/hooks/useCallApi";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { ISiteDetail } from "@/sevices/site";
import { useMounted } from "@/hooks/useMouted";
import { Skeleton } from "@/components/ui/skeleton";

interface IProps {}

export const CardSites = ({}: IProps) => {
  const { mounted } = useMounted();

  const [domain, setDomain] = useState<string>("");
  const [openedDialog, setOpenedDialog] = useState<boolean>(false);

  const {
    data: sites,
    loading: fetching,
    setLetCall: getSites,
  } = useCallApi<ISiteDetail[], {}, {}>({
    url: `/api/sites`,
    options: {
      method: "GET",
    },
    nonCallInit: true,
  });

  const { promiseFunc: createSite, loading: creating } = useCallApi<
    {},
    {},
    { domain: string }
  >({
    url: `/api/sites`,
    options: {
      method: "POST",
    },
    nonCallInit: true,
    handleSuccess() {
      getSites(true);

      setOpenedDialog(false);
      setDomain("");
    },
  });

  useEffect(() => {
    mounted && getSites(true);
  }, [mounted, getSites]);

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="mb-2">Sites</CardTitle>
          <Button
            className="w-fit"
            onClick={() => {
              setDomain("");
              setOpenedDialog(true);
            }}
          >
            Add site
          </Button>
        </CardHeader>
        <CardContent>
          <Accordion type="multiple" className="w-full space-y-4">
            {fetching && (
              <>
                <Skeleton className="h-14 w-full border" />
                <Skeleton className="h-14 w-full border" />
              </>
            )}
            {sites?.map((site) => (
              <AccordionItem className="border-0" key={site.id} value={site.id}>
                <Card>
                  <CardContent className="py-0">
                    <AccordionTrigger>{site.domain}</AccordionTrigger>
                    <AccordionContent>
                      Yes. It adheres to the WAI-ARIA design pattern.
                    </AccordionContent>
                  </CardContent>
                </Card>
              </AccordionItem>
            ))}
          </Accordion>
        </CardContent>
      </Card>
      <Dialog open={openedDialog} onOpenChange={setOpenedDialog}>
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
              loading={creating}
              onClick={() => createSite({ domain })}
            >
              Add site
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
