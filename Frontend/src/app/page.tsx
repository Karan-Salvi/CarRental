import { Suspense } from "react";
import Image from "next/image";
import CarCard from "@/components/car-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Star } from "lucide-react";
import { getAllCars } from "@/ai/flows/get-cars-flow";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import Carlist from "@/components/Carlist";

function CarListSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="flex flex-col space-y-3">
          <Skeleton className="h-[225px] w-full rounded-xl" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        </div>
      ))}
    </div>
  );
}

const testimonials = [
  {
    name: "Emma Rodriguez",
    location: "Barcelona, Spain",
    avatarUrl: "https://randomuser.me/api/portraits/women/68.jpg",
    review:
      "I rented a car from various companies, but CarRental provides the best value and service. I highly recommend them!",
  },
  {
    name: "John Smith",
    location: "New York, USA",
    avatarUrl: "https://randomuser.me/api/portraits/men/32.jpg",
    review:
      "CarRental made my trip so much easier. The reservation process was seamless, and the car was in perfect condition.",
  },
  {
    name: "Ava Johnson",
    location: "Sydney, Australia",
    avatarUrl: "https://randomuser.me/api/portraits/women/44.jpg",
    review:
      "I highly recommend CarRental! The team is friendly and professional, providing an excellent renting experience.",
  },
];

export default function Home() {
  // const { user } = useSelector((state) => state.auth);
  // console.log(user);

  return (
    <div className="flex flex-col bg-background ">
      <section className="w-full pt-20 md:pt-28 lg:pt-30 bg-gradient-to-br from-white to-slate-200">
        <div className="container mx-auto px-4 md:px-6 text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-4 tracking-tight text-primary">
            Luxury cars on Rent
          </h1>
          <Link
            href="/cars"
            className="max-w-4xl mx-auto bg-card p-4 rounded-full shadow-lg grid md:grid-cols-4 gap-4 items-center mt-12 mb-8"
          >
            <div className="relative md:col-span-2">
              <Input
                placeholder="Pick-up location"
                className="h-12 bg-background border-none rounded-full"
              />
            </div>
            <Input
              type="date"
              placeholder="Pick-up date"
              className="h-12 bg-background border-none rounded-full text-muted-foreground"
            />
            <Input
              type="date"
              placeholder="Return date"
              className="h-12 bg-background border-none rounded-full text-muted-foreground"
            />
          </Link>
          <div className="w-full flex justify-center">
            <Image
              src="/images/car1.png"
              alt="car1"
              width={700}
              height={300}
              className="object-contain"
              data-ai-hint="silver car"
            />
          </div>
        </div>
      </section>

      <section className="container max-w-7xl mx-auto px-4 py-16 md:py-24 ">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-black text-primary mb-2">
            Featured Vehicles
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Explore our selection of premium vehicles available for your next
            adventure
          </p>
        </div>
        <Suspense fallback={<CarListSkeleton />}>
          <Carlist />
        </Suspense>
      </section>

      <section className="py-16 md:py-24 bg-white ">
        <div className="container mx-auto px-4 md:px-6 max-w-7xl">
          <div className="bg-gradient-to-br from-blue-300 to-blue-800 rounded-2xl p-8 md:p-12 grid md:grid-cols-2 gap-8 items-center text-white">
            <div className="space-y-4">
              <h2 className="text-3xl md:text-4xl font-extrabold text-white">
                Want to Drive a Luxury Car?
              </h2>
              <p className="text-lg opacity-80">
                Join our community of premium car renters and get access to a
                wide range of luxury vehicles at your fingertips. Enjoy a
                seamless booking experience, fully insured rides, and the trust
                of a verified car-sharing community.
              </p>
              <Button
                size="lg"
                variant="secondary"
                className="mt-4 text-primary font-extrabold"
              >
                Book Your Car
              </Button>
            </div>
            <div className="flex justify-center">
              <Image
                src="/images/car1.png"
                alt="Luxury car"
                width={500}
                height={300}
                className="rounded-xl object-cover"
                data-ai-hint="white bmw"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 md:px-6 max-w-7xl">
          <h2 className="text-3xl font-bold text-center text-primary mb-2">
            What Our Customers Say
          </h2>
          <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
            We pride ourselves on providing an exceptional experience. Here's
            what our satisfied customers have to say about us.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card
                key={index}
                className="shadow-sm bg-white border rounded-xl"
              >
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    <Avatar className="h-12 w-12 mr-4">
                      <AvatarImage
                        src={testimonial.avatarUrl}
                        alt={testimonial.name}
                      />
                      <AvatarFallback>
                        {testimonial.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h4 className="font-semibold text-primary">
                        {testimonial.name}
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        {testimonial.location}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className="w-5 h-5 text-blue-500 fill-current"
                      />
                    ))}
                  </div>
                  <p className="text-muted-foreground italic">
                    &quot;{testimonial.review}&quot;
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4 md:px-6 text-center max-w-2xl">
          <h2 className="text-3xl font-bold text-primary mb-2">
            Never Miss a Deal!
          </h2>
          <p className="text-muted-foreground mb-8">
            Subscribe to get the latest offers, new vehicle announcements, and
            exclusive deals.
          </p>
          <div className="flex flex-col sm:flex-row  max-w-md mx-auto">
            <Input
              placeholder="Enter your email"
              className="h-12 text-base rounded-l-lg rounded-r-none"
            />
            <Button className="rounded-r-lg rounded-l-none h-12">
              Subscribe
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
