import {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

import { ChevronLeftIcon, ChevronRightIcon } from "@radix-ui/react-icons";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import Link from "next/link";

const filters = [
  {
    name: "Career Paths",
    options: [
      { name: "Frontend engineering", id: "front-eng" },
      { name: "Backend engineering", id: "back-eng" },
    ],
  },
  {
    name: "Problem Categories",
    options: [
      { name: "Payments", id: "payments" },
      { name: "Forms", id: "forms" },
      { name: "Authentication", id: "authentication" },
      { name: "Authorization", id: "authorization" },
    ],
  },
  {
    name: "Difficulty",
    options: [
      { name: "Easy", id: "easy" },
      { name: "Medium", id: "medium" },
      { name: "Hard", id: "hard" },
    ],
  },
];

export default function Challenges() {
  return (
    <div className="w-full pt-8">
      <div className="grid grid-cols-12 gap-12">
        <div className="col-span-8 grid w-full grid-cols-1 gap-8">
          {[1, 2, 3, 4, 5].map((x) => (
            <Card className="relative" key={x}>
              <img
                src="https://hrcdn.net/s3_pub/hr-assets/dashboard/Angular.svg"
                alt="angular logo"
                className="absolute right-5 top-2 w-40 opacity-10"
              />

              <CardHeader>
                <CardTitle>Contentful: Customer Signup Form</CardTitle>
                <CardDescription>
                  You will create the customer signup form at contentful, which
                  accepts new customers and collects marketing information such
                  as company and role of customer.
                </CardDescription>
                <div className="flex space-x-2">
                  <Badge>Payments</Badge>
                  <Badge variant="outline">Easy</Badge>
                </div>
              </CardHeader>

              <CardFooter className="flex justify-end">
                <Link
                  href="/challenges/contentful-customer-signup-form"
                  className="z-10"
                >
                  <Button variant="secondary">
                    Begin challenge
                    <ChevronRightIcon className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          ))}

          <div className="mt-4 flex items-center justify-between">
            <Button variant="secondary">
              {" "}
              <ChevronLeftIcon /> Previous
            </Button>
            <Button variant="secondary">
              Next <ChevronRightIcon />
            </Button>
          </div>
        </div>

        <div className="col-span-4 w-full">
          <div className="fixed flex flex-col space-y-8">
            {filters.map((filterGroup, idx) => (
              <div className="flex flex-col" key={idx}>
                <h3 className="text-sm font-medium uppercase text-muted-foreground">
                  {filterGroup.name}
                </h3>

                <div className="mt-4 flex flex-col space-y-2">
                  {filterGroup.options.map((filter) => (
                    <div
                      key={filter.id}
                      className="flex items-center space-x-2"
                    >
                      <Checkbox
                        id={`filter-${filter.id}`}
                        className="h-5 w-5"
                      />
                      <Label htmlFor={`filter-${filter.id}`}>
                        {filter.name}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
