import Link from "next/link";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { CardPublicApiKey } from "@/modules/api-keys/CardPublicApiKey";

const ListApiKey = () => {
  return (
    <div className="p-4 md:p-6">
      <div className="left-0 top-0 flex items-center max-md:mb-4 md:absolute md:h-16 md:px-16">
        <div className="h-4 border-l border-l-border px-2 max-md:hidden" />
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href="/dashboard">Dashboard</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>API Keys</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>
      <div className="mb-4 sm:mb-6">
        <div className="w-full lg:w-1/2">
          <CardPublicApiKey />
        </div>
      </div>
    </div>
  );
};

export default ListApiKey;
