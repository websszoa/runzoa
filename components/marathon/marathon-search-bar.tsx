import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { SubmitHandler, UseFormReturn } from "react-hook-form";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { CalendarHeart, BookImage, Grid, Medal, Search } from "lucide-react";
import { SearchFormValues } from "@/lib/types";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

type ViewMode = "card" | "date" | "image" | "medal";

type MarathonSearchBarProps = {
  form: UseFormReturn<SearchFormValues>;
  onSubmitSearch: SubmitHandler<SearchFormValues>;
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
};

export default function MarathonSearchBar({
  form,
  onSubmitSearch,
  viewMode,
  setViewMode,
}: MarathonSearchBarProps) {
  return (
    <div className="marathon__search__bar">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-4">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmitSearch)}
            className="relative flex w-full flex-col gap-2 sm:w-80 sm:flex-row sm:gap-4"
          >
            <FormField
              control={form.control}
              name="keyword"
              render={({ field }) => (
                <FormItem className="w-full">
                  <div className="flex w-full items-center gap-2">
                    <FormControl>
                      <Input
                        {...field}
                        value={field.value ?? ""}
                        onChange={field.onChange}
                        placeholder="마라톤명 검색"
                        className="h-10 w-full"
                      />
                    </FormControl>
                    <Button
                      type="submit"
                      variant="outline"
                      size="icon"
                      className="shrink-0 h-10 w-10"
                    >
                      <Search className="h-4 w-4" />
                      <span className="sr-only">검색</span>
                    </Button>
                  </div>
                </FormItem>
              )}
            />
          </form>
        </Form>

        <div className="w-full sm:w-auto flex justify-center gap-1 sm:justify-start mt-2 sm:mt-0">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant={viewMode === "card" ? "destructive" : "pink"}
                className="w-10 h-10 rounded-full"
                onClick={() => setViewMode("card")}
              >
                <Grid className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>카드형</p>
            </TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant={viewMode === "date" ? "destructive" : "pink"}
                className="w-10 h-10 rounded-full"
                onClick={() => setViewMode("date")}
              >
                <CalendarHeart className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>날짜형</p>
            </TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant={viewMode === "image" ? "destructive" : "pink"}
                className="w-10 h-10 rounded-full"
                onClick={() => setViewMode("image")}
              >
                <BookImage className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>이미지형</p>
            </TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant={viewMode === "medal" ? "destructive" : "pink"}
                className="w-10 h-10 rounded-full"
                onClick={() => setViewMode("medal")}
              >
                <Medal className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>메달형</p>
            </TooltipContent>
          </Tooltip>
        </div>
      </div>
    </div>
  );
}
