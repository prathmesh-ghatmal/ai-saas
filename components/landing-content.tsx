"use client";

import { title } from "process";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

const testimonials = [
  {
    name: "Prathmesh",
    title: "Software Engineer",
    description:
      "This platform has completely revolutionized the way I work with AI tools.",
  },
  {
    name: "Aarya",
    title: "Product Manager",
    description:
      "The intuitive design and powerful features make this a must-have for anyone in tech.",
  },
  {
    name: "Prasad",
    title: "Data Scientist",
    description:
      "I’ve tried many AI tools, but this one stands out with its exceptional performance.",
  },
  {
    name: "Tejas",
    title: "UX Designer",
    description:
      "A seamless experience that combines AI power with user-friendly design. Highly recommended!",
  },
];

export const LandingContent = () => {
  return (
    <div className=" px-1 pb-10">
      <h2 className=" text-center text-4xl text-white font-extrabold mb-10">
        Testimonials
      </h2>
      <div className=" grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {testimonials.map((item) => (
          <Card
            key={item.name}
            className=" bg-[#192339] border-none text-white"
          >
            <CardHeader>
              <CardTitle className=" flex items-center gap-x-2">
                <div>
                  <p className=" text-lg">{item.name}</p>
                  <p className=" text-zinc-400 text-sm">{item.title}</p>
                </div>
              </CardTitle>
              <CardContent className=" pt-4 px-0">
                {item.description}
              </CardContent>
            </CardHeader>
          </Card>
        ))}
      </div>
    </div>
  );
};
