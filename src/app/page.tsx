import { BlockCompareOGImage, BlockInputDemo } from "@/components/block";
import { IGetDemoResponse } from "@/sevices/demo";

export default function Home() {
  const initPageInfo: IGetDemoResponse[] = [
    {
      url: "https://www.uber.com",
      smartOgImageBase64: "/demo/uber-home.png",
      title: "Explore the Uber Platform | Uber United States",
      description:
        "Learn how you can leverage the Uber platform and apps to earn more, eat, commute, get a ride, simplify business travel, and more.",
      ogImage:
        "https://d3i4yxtzktqr9n.cloudfront.net/uber-sites/f452c7aefd72a6f52b36705c8015464e.jpg",
    },
    {
      url: "https://www.uber.com/us/en/business/getting-started/",
      smartOgImageBase64: "/demo/uber-business-started.png",
      title: "Getting started with Uber for Business",
      description:
        "Easily manage business travel, employee meals and local deliveries. Simplify how your business moves with automatic billing, expensing, and reporting.",
      ogImage:
        "https://d3i4yxtzktqr9n.cloudfront.net/uber-sites/f452c7aefd72a6f52b36705c8015464e.jpg",
    },
    {
      url: "https://www.uber.com/us/en/business/",
      smartOgImageBase64: "/demo/uber-business.png",
      title: "Business Travel and Meals | Uber for Business",
      description:
        "Manage corporate rides and meals from one platform built for businesses. More than 170,000 companies worldwide use/choose Uber for Business.",
      ogImage:
        "https://d3i4yxtzktqr9n.cloudfront.net/uber-sites/f452c7aefd72a6f52b36705c8015464e.jpg",
    },
    {
      url: "https://www.uber.com/us/en/about/",
      smartOgImageBase64: "/demo/uber-about.png",
      title: "About Us | Uber",
      description:
        "Want to learn more about Uber? Read about our leadership, customers, the Uber platform, the communities we serve, and more!",
      ogImage:
        "https://d3i4yxtzktqr9n.cloudfront.net/uber-sites/f452c7aefd72a6f52b36705c8015464e.jpg",
    },
  ];

  return (
    <>
      <BlockInputDemo />
      <BlockCompareOGImage pagesInfo={initPageInfo} loading={false} />
    </>
  );
}
