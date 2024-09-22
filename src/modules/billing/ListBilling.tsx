import { CardPlan } from "@/components/customs/CardPlan";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { planService } from "@/services/plan";

export const ListBilling = async () => {
  const plans = await planService.getAll();

  return (
    <>
      <div className="p-4">
        <Breadcrumb className="mb-4">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/image-og/public">Home</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Billing</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4 lg:items-center">
          {plans.data?.map((plan) => <CardPlan key={plan.id} plan={plan} />)}
        </div>
      </div>
    </>
  );
};
