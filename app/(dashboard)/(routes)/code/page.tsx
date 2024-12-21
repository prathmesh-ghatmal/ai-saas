"use client";
import { Code } from "lucide-react";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { fromSchema } from "./constants";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { CreateChatCompletionRequestMessage } from "openai/resources/index.mjs";
import { Empty } from "@/components/empty";
import { Loader } from "@/components/loader";
import { cn } from "@/lib/utils";
import { UserAvatar } from "@/components/uset-avatar";
import { BotAvatar } from "@/components/bot-avatar";
import ReactMarkdown from "react-markdown";
import Navbar from "@/components/navbar";
import { useProModal } from "@/hooks/use-pro-modal";

const CodeGeneration = () => {
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
        setCount(response2.data.count);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const onSubmit = async (values: z.infer<typeof fromSchema>) => {
    try {
      const userMessages: CreateChatCompletionRequestMessage = {
        role: "user",
        content: values.prompt,
      };
      const newMessages = [...messages, userMessages];
      const response = await axios.post("/api/code", {
        messages: newMessages,
      });

      const response2 = await axios.post("/api/demo");
      setCount(response2.data.count);

      setMessages((current) => [...current, userMessages, response.data]);
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

  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  return (
    <div>
      <Navbar
        title="Code generation"
        icon={Code}
        iconColor="text-yellow-500"
        bgColor="bg-yellow-500/10"
        count={count}
      />
      <div className=" px-4 lg:px-8">
        <div className=" space-y-4 mt-4">
          {isLoading && (
            <div className="fixed top-16 left-0 md:left-72 md:ml-4 right-0 md:mr-8 p-8 rounded-lg  flex items-center justify-center bg-white z-50">
              <Loader />
            </div>
          )}
          {messages.length === 0 && !isLoading && (
            <Empty label="conversation not started yet" />
          )}
          <div className=" pb-24 flex flex-col gap-y-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={cn(
                  " p-8 w-full flex items-start gap-x-8 rounded-lg ",
                  message.role === "user"
                    ? " bg-white border border-black/10"
                    : "bg-muted"
                )}
              >
                {message.role === "user" ? <UserAvatar /> : <BotAvatar />}
                <ReactMarkdown
                  components={{
                    pre: ({ ...props }) => (
                      <div className=" overflow-auto w-full my-2 bg-black/10 p-2 rounded-lg">
                        {" "}
                        <pre {...props} />
                      </div>
                    ),
                    code: ({ ...props }) => (
                      <code
                        className=" bg-black/10 rounded-lg p-1"
                        {...props}
                      />
                    ),
                  }}
                  className="text-sm overflow-x-hidden leading-7"
                >
                  {String(message.content) || ""}
                </ReactMarkdown>
              </div>
            ))}
            <div ref={bottomRef} />
          </div>
        </div>
        <div>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className=" fixed bottom-0 left-0 md:left-72 right-0 mr-4 md:mr-8  ml-4 md:ml-8 rounded-lg border  p-4 px-3 md:px-6 focus-within:shadow-sm grid grid-cols-12 gap-2 bg-white"
            >
              <FormField
                name="prompt"
                render={({ field }) => (
                  <FormItem className=" col-span-12 lg:col-span-10">
                    <FormControl className=" m-0 p-0">
                      <Input
                        className=" border-0 outline-none focus-visible:ring-0 focus-visible:ring-transparent"
                        disabled={isLoading}
                        placeholder="write a program for a fibonnaci series"
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
      </div>
    </div>
  );
};
export default CodeGeneration;
