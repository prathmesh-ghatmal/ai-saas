"use client";
import * as z from "zod";
import { Heading } from "@/components/heading";
import { useForm } from "react-hook-form";
import { fromSchema } from "./constants";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { CreateChatCompletionRequestMessage } from "openai/resources/index.mjs";
import { Empty } from "@/components/empty";
import { Loader } from "@/components/loader";

import { Music, Video } from "lucide-react";
import Navbar from "@/components/navbar";
import { useProModal } from "@/hooks/use-pro-modal";

const MusicGenerationPage = () => {
  const proModal = useProModal();

  const router = useRouter();
  const [music, setMusic] = useState<string>();
  const [count, setCount] = useState<number>(0);

  const form = useForm<z.infer<typeof fromSchema>>({
    resolver: zodResolver(fromSchema),
    defaultValues: { prompt: "" },
  });

  const isLoading = form.formState.isSubmitting;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response2 = await axios.post("/api/demo");
        setCount(response2.data.count); // Set the state with the count value from the response
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData(); // Call the fetch function when the component mounts or reloads
  }, []);

  const onSubmit = async (values: z.infer<typeof fromSchema>) => {
    try {
      setMusic(undefined);
      const response = await axios.post("/api/music", values);
      console.log("Generated Music URL pgggg:", response.data.output.audio);
      const audio = response.data.output.audio;

      setMusic(audio);

      const response2 = await axios.post("/api/demo");
      setCount(response2.data.count);

      form.reset();
    } catch (error: any) {
      if (error?.response?.status === 403) {
        proModal.onOpen();
      }
      console.log(error);
    } finally {
      router.refresh();
    }
  };
  return (
    <div>
      <Navbar
        title="Music Generation"
        // description="Best music generation ai model"
        icon={Music}
        iconColor="text-emerald-500"
        bgColor="bg-emerald-500/10"
        count={count}
      />
      <div className=" px-4 lg:px-8">
        <div>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className=" rounded-lg border w-full p-4 px-3 md:px-6 focus-within:shadow-sm grid grid-cols-12 gap-2"
            >
              <FormField
                name="prompt"
                render={({ field }) => (
                  <FormItem className=" col-span-12 lg:col-span-10">
                    <FormControl className=" m-0 p-0">
                      <Input
                        className=" border-0 outline-none focus-visible:ring-0 focus-visible:ring-transparent"
                        disabled={isLoading}
                        placeholder="Enter a prompt to generate music"
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <Button
                className=" col-span-12 lg:col-span-2 w-full"
                disabled={isLoading}
              >
                Generate
              </Button>
            </form>
          </Form>
        </div>
        <div className=" space-y-4 mt-4">
          {isLoading && (
            <div className=" p-8 rounded-lg w-full flex items-center justify-center bg-muted">
              <Loader />
            </div>
          )}
          {!music && !isLoading && <Empty label="no music generated yet" />}
          {music && (
            <audio controls className=" w-full mt8">
              <source src={music} />
            </audio>
          )}
        </div>
      </div>
    </div>
  );
};

export default MusicGenerationPage;
