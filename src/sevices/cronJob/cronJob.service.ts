import { prisma } from "@/lib/db";

class CronJobService {
  async updateOGImage() {
    console.log("Running daily update OG Image");
    const today = new Date();

    try {
      const ogImages = await prisma.oGImage.findMany({
        where: {
          expiresAt: {
            lte: today,
          },
        },
        include: {
          Page: true,
        },
      });

      for (const ogImage of ogImages) {
        const page = ogImage.Page;
      }
    } catch (error) {
      console.error(error);
      return {
        message: "Internal Server Error",
        status: 500,
        data: null,
      };
    }
  }
}

const cronJobService = new CronJobService();

export default cronJobService;
