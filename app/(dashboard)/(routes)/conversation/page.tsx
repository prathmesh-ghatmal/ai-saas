"use client";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useRouter } from "next/navigation";
import { CreateChatCompletionRequestMessage } from "openai/resources/index.mjs";
import { Empty } from "@/components/empty";
import { Loader } from "@/components/loader";
import { cn } from "@/lib/utils";
import { UserAvatar } from "@/components/uset-avatar";
import { BotAvatar } from "@/components/bot-avatar";
import Navbar from "@/components/navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { MessageSquare } from "lucide-react";
import { fromSchema } from "./constants";
import { useProModal } from "@/hooks/use-pro-modal";

const ConversationPage = () => {
  const proModal = useProModal();

  const router = useRouter();
  const [messages, setMessages] = useState<
    CreateChatCompletionRequestMessage[]
  >([]);
  const [count, setCount] = useState<number>(0);

  const form = useForm<z.infer<typeof fromSchema>>({
    resolver: zodResolver(fromSchema),
    defaultValues: { prompt: "" },
  });
  const isLoading = form.formState.isSubmitting;
  const bottomRef = useRef<HTMLDivElement>(null);

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
      const userMessages: CreateChatCompletionRequestMessage = {
        role: "user",
        content: values.prompt,
      };
      const newMessages = [...messages, userMessages];
      const response = await axios.post("/api/conversation", {
        messages: newMessages,
      });
      // const response2 = await axios.post("/api/demo");
      // setCount(response2.data.count);

      setMessages((current) => [...current, userMessages, response.data]);
      form.reset();
    } catch (error: any) {
      if (error?.response?.status === 403) {
        proModal.onOpen();
      }
    } finally {
      router.refresh();
    }
  };

  console.log("kkkkkkkkkkkkkkkkkkkkkkk", count);

  // Scroll to bottom when messages change
  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  //  useEffect(() => {
  //     const pollSubscriptionStatus = async () => {
  //       try {
  //         const response = await axios.get("/api/status");
  //         console.log("polllinggggggggggg", response);
  //         const { status } = response.data;

  //         if (status === "active") {
  //           console.log("Subscription is active! Redirecting to home page...");
  //           clearInterval(interval); // Stop polling when subscription is active
  //           router.push("/"); // Redirect to home page
  //         }
  //       } catch (error) {
  //         console.error("Error checking subscription status:", error);
  //       }
  //     };

  //     // Set up polling every 3 seconds
  //     const interval = setInterval(pollSubscriptionStatus, 3000);

  //     // Cleanup on component unmount
  //     return () => clearInterval(interval);
  //   }, [router]);
  return (
    <div>
      <Navbar
        title="Conversation"
        icon={MessageSquare}
        iconColor="text-violet-500"
        count={count}
        bgColor="bg-violet-500/10"
      />
      <div className="px-4 lg:px-8">
        <div className="space-y-4 mt-4">
          {isLoading && (
            <div className=" pt-10  fixed top-16 left-0 md:left-72 right-0 ml-4 mr-4 md:ml-8 bg-white z-50">
              <Loader />
            </div>
          )}
          {messages.length === 0 && !isLoading && (
            <Empty label="conversation not started yet" />
          )}
          <div className="pb-24 flex flex-col overflow-auto gap-y-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={cn(
                  "p-8 w-full flex items-start gap-x-8 rounded-lg",
                  message.role === "user"
                    ? "bg-white border border-black/10"
                    : "bg-muted"
                )}
              >
                {message.role === "user" ? <UserAvatar /> : <BotAvatar />}
                <p className="text-sm">
                  {typeof message.content === "string"
                    ? message.content
                    : "No content available"}
                </p>
              </div>
            ))}
            <div ref={bottomRef} />
          </div>
        </div>
        <div className="mt-4 fixed bottom-0 left-0 md:left-72 right-0 ml-4 mr-4 md:ml-8 bg-white">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="rounded-lg border w-full p-4 px-3 md:px-6 focus-within:shadow-sm grid grid-cols-12 gap-2"
            >
              <FormField
                name="prompt"
                render={({ field }) => (
                  <FormItem className="col-span-12 lg:col-span-10">
                    <FormControl className="m-0 p-0">
                      <Input
                        className="border-0 outline-none focus-visible:ring-0 focus-visible:ring-transparent"
                        disabled={isLoading}
                        placeholder="How do I calculate the radius of a circle?"
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <Button
                className="col-span-12 lg:col-span-2 w-full"
                disabled={isLoading}
              >
                Generate
              </Button>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default ConversationPage;
