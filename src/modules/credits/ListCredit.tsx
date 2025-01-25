import { Product } from "@prisma/client";

import Link from "next/link";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { CardCredit, CardProducts } from "@/modules/credits";

interface IProps {
  products: Product[];
}

const ListCredit = ({ products }: IProps) => {
  return (
    <>
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
                <BreadcrumbPage>Credits</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>

        <div className="mb-4 flex flex-col gap-4 sm:mb-6 sm:gap-6">
          <div className="grid grid-cols-1 gap-4 sm:gap-6 xl:grid-cols-2">
            <CardCredit />
          </div>
          {products && <CardProducts products={products} />}
        </div>
      </div>
    </>
  );
};

export default ListCredit;
