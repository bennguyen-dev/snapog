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
import { Typography } from "@/components/ui/typography";
import Link from "next/link";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DURATION_CACHE } from "@/lib/constants";
import { CodeSnippet } from "@/components/ui/code-snippet";

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
            {sites?.map((site) => {
              const urlExample = `https://${window.location.host}/api/get-image?url=${site.domain}`;

              return (
                <AccordionItem
                  className="border-0"
                  key={site.id}
                  value={site.id}
                >
                  <Card>
                    <CardContent className="py-0">
                      <AccordionTrigger className="px-2">
                        {site.domain}
                      </AccordionTrigger>
                      <AccordionContent className="-mx-1 pb-6">
                        <div className="px-2">
                          <Typography
                            affects="small"
                            className="mb-4 text-gray-500"
                          >
                            Example URL:{" "}
                            <Link
                              href={urlExample}
                              target="_blank"
                              className="text-blue-500 hover:underline"
                            >
                              {urlExample}
                            </Link>
                          </Typography>

                          <Label htmlFor="duration">Duration cache</Label>
                          <Select value={"1"}>
                            <SelectTrigger className="mb-4 mt-1">
                              <SelectValue
                                id="duration"
                                placeholder="Duration cache"
                              />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectGroup>
                                {DURATION_CACHE.map((duration) => (
                                  <SelectItem
                                    key={duration.value}
                                    value={`${duration.value}`}
                                  >
                                    {duration.label}
                                  </SelectItem>
                                ))}
                              </SelectGroup>
                            </SelectContent>
                          </Select>

                          <div className="flex flex-col">
                            <Label htmlFor="duration">Snippet</Label>
                            <CodeSnippet />
                          </div>
                        </div>
                      </AccordionContent>
                    </CardContent>
                  </Card>
                </AccordionItem>
              );
            })}
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
