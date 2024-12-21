import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Zap } from "lucide-react";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import axios from "axios";
import { useProcessingModal } from "@/hooks/use-processing-modal copy";

export const ProcessingModal = () => {
  const proModal = useProcessingModal();

  const onSubscribe = async () => {
    try {
      //proModal.onClose();
      const response = axios.post("/api/redirect");
      if ((await response).data === "active") {
        proModal.onClose();
      } else if ((await response).data === "created") {
        alert(
          "your payment is pending please complete the payment if already done please wait patiently  for a moment"
        );
      } else if ((await response).data === "authenticated") {
        proModal.onClose();
      }
      {
        alert("your payment status is " + (await response).data);
      }
      console.log((await response).data);
      // window.location.href = (await response).data.url;
    } catch (error) {
      console.log(error, "RAZORPAY_CLIENT_ERROR");
    } finally {
    }
  };

  return (
    <Dialog open={proModal.isOpen} onOpenChange={proModal.onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex justify-center items-center flex-col gap-y-4 pb-2">
            <div className="flex items-center gap-x-2 font-bold py-1">
              upgrade to genius
              <Badge variant="premium" className="uppercase text-sm py-1">
                pro
              </Badge>
            </div>
          </DialogTitle>
        </DialogHeader>

        <DialogFooter>
          <Button onClick={onSubscribe} variant="premium" className="w-full">
            check payment status <Zap className="w-4 h-4 ml-2 fill-white" />
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
