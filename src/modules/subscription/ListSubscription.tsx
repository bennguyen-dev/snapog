"use client";

import {
  getAllPlan,
  getCurrentSubscription,
  getUserUsage,
} from "@/app/actions";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { useCallAction } from "@/hooks/useCallAction";
import {
  CardCurrentSubscription,
  CardDefaultSubscription,
  CardUserUsage,
  CardUpdatePlan,
} from "@/modules/subscription";

export const ListSubscription = () => {
  const { data: userSubscription, setLetCall: getCurrentSub } = useCallAction({
    action: getCurrentSubscription,
  });
  const {
    data: userUsage,
    setLetCall: getUsage,
    loading: fetchingUsage,
  } = useCallAction({
    action: getUserUsage,
  });
  const { data: plans } = useCallAction({ action: getAllPlan });

  return (
    <>
      <div className="p-4 sm:p-6">
        <Breadcrumb className="mb-4">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/dashboard/sites">Home</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Subscription</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <div className="mb-4 sm:mb-6">
          <CardUserUsage userUsage={userUsage} loading={fetchingUsage} />
        </div>
        <div className="mb-4 sm:mb-6">
          {!userSubscription ? (
            <CardDefaultSubscription />
          ) : (
            <CardCurrentSubscription
              subscription={userSubscription}
              cbSuccess={() => {
                getCurrentSub(true);
                getUsage(true);
              }}
            />
          )}
        </div>
        {plans && plans.length > 0 && (
          <CardUpdatePlan
            plans={plans}
            cbSuccess={() => {
              getCurrentSub(true);
              getUsage(true);
            }}
            userSubscription={userSubscription}
          />
        )}
      </div>
    </>
  );
};
