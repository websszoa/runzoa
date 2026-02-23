"use client";

import { useEffect, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Minus, Plus } from "lucide-react";
import { toast } from "sonner";
import { Marathon, MarathonEditFormValues } from "@/lib/types";
import { marathonEditSchema } from "@/lib/validations";
import { marathonEditAction } from "@/lib/actions/marathon-edit";
import { marathonDeleteAction } from "@/lib/actions/marathon-delete";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type DialogMarathonEditProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  marathon: Marathon | null;
  onUpdated: (updatedMarathon: Marathon) => void;
  onDeleted?: (deletedMarathon: Marathon) => void;
};

const emptyEditValues: MarathonEditFormValues = {
  id: "",
  name: "",
  slug: "",
  description: "",
  event_start_date: "",
  event_start_time: "",
  event_end_date: "",
  event_end_time: "",
  event_type: "",
  event_scale: "",
  event_site: "",
  registration_status: "접수중",
  registration_start_date: "",
  registration_start_time: "",
  registration_end_date: "",
  registration_end_time: "",
  registration_add_start_date: "",
  registration_add_start_time: "",
  registration_add_end_date: "",
  registration_add_end_time: "",
  registration_site: "",
  registration_prices: [{ distance: "", price: "" }],
  location_country: "",
  location_region: "",
  location_place: "",
  location_lat: "",
  location_lng: "",
  images_cover: [{ src: "" }],
  images_medal: [{ src: "" }],
  images_souvenir: [{ src: "" }],
  images_detail: [{ src: "" }],
  host_organizer: "",
  host_manage: "",
  host_sponsor: "",
  host_souvenir: "",
  host_phone: "",
  host_email: "",
  sns_kakao: "",
  sns_instagram: "",
  sns_blog: "",
  sns_youtube: "",
};

function isoToDate(iso: string | null | undefined): string {
  if (!iso) return "";
  return iso.slice(0, 10);
}
function isoToTime(iso: string | null | undefined): string {
  if (!iso) return "";
  return iso.slice(11, 16) || "";
}

function marathonToEditValues(m: Marathon): MarathonEditFormValues {
  return {
    id: m.id,
    name: m.name ?? "",
    slug: m.slug ?? "",
    description: m.description ?? "",
    event_start_date: isoToDate(m.event_start_at),
    event_start_time: isoToTime(m.event_start_at),
    event_end_date: isoToDate(m.event_end_at),
    event_end_time: isoToTime(m.event_end_at),
    event_type: m.event_type ?? "",
    event_scale: m.event_scale != null ? String(m.event_scale) : "",
    event_site: m.event_site ?? "",
    registration_status: m.registration_status,
    registration_start_date: isoToDate(m.registration_start_at),
    registration_start_time: isoToTime(m.registration_start_at),
    registration_end_date: isoToDate(m.registration_end_at),
    registration_end_time: isoToTime(m.registration_end_at),
    registration_add_start_date: isoToDate(m.registration_add_start_at),
    registration_add_start_time: isoToTime(m.registration_add_start_at),
    registration_add_end_date: isoToDate(m.registration_add_end_at),
    registration_add_end_time: isoToTime(m.registration_add_end_at),
    registration_site: m.registration_site ?? "",
    registration_prices:
      m.registration_price && m.registration_price.length > 0
        ? m.registration_price.map((p) => ({
            distance: p.distance ?? "",
            price: p.price != null ? String(p.price) : "",
          }))
        : [{ distance: "", price: "" }],
    location_country: m.location?.country ?? m.country ?? "",
    location_region: m.location?.region ?? m.region ?? "",
    location_place: m.location?.place ?? "",
    location_lat: m.location?.lat != null ? String(m.location.lat) : "",
    location_lng: m.location?.lng != null ? String(m.location.lng) : "",
    images_cover: (m.images?.cover?.length ? m.images.cover : [""]).map(
      (src) => ({
        src: typeof src === "string" ? src : "",
      }),
    ),
    images_medal: (m.images?.medal?.length ? m.images.medal : [""]).map(
      (src) => ({
        src: typeof src === "string" ? src : "",
      }),
    ),
    images_souvenir: (m.images?.souvenir?.length
      ? m.images.souvenir
      : [""]
    ).map((src) => ({
      src: typeof src === "string" ? src : "",
    })),
    images_detail: (m.images?.detail?.length ? m.images.detail : [""]).map(
      (src) => ({
        src: typeof src === "string" ? src : "",
      }),
    ),
    host_organizer: m.hosts?.organizer ?? "",
    host_manage: m.hosts?.manage ?? "",
    host_sponsor: m.hosts?.sponsor ?? "",
    host_souvenir: m.hosts?.souvenir ?? "",
    host_phone: m.hosts?.phone ?? "",
    host_email: m.hosts?.email ?? "",
    sns_kakao: m.sns?.kakao ?? "",
    sns_instagram: m.sns?.instagram ?? "",
    sns_blog: m.sns?.blog ?? "",
    sns_youtube: m.sns?.youtube ?? "",
  };
}

export default function DialogMarathonEdit({
  open,
  onOpenChange,
  marathon,
  onUpdated,
  onDeleted,
}: DialogMarathonEditProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const form = useForm<MarathonEditFormValues>({
    resolver: zodResolver(marathonEditSchema),
    defaultValues: emptyEditValues,
  });

  useEffect(() => {
    if (!open) return;
    if (!marathon) {
      form.reset(emptyEditValues);
      return;
    }
    form.reset(marathonToEditValues(marathon));
  }, [open, marathon, form]);

  const pricesFieldArray = useFieldArray({
    control: form.control,
    name: "registration_prices",
  });
  const coverImagesFieldArray = useFieldArray({
    control: form.control,
    name: "images_cover",
  });
  const medalImagesFieldArray = useFieldArray({
    control: form.control,
    name: "images_medal",
  });
  const souvenirImagesFieldArray = useFieldArray({
    control: form.control,
    name: "images_souvenir",
  });
  const detailImagesFieldArray = useFieldArray({
    control: form.control,
    name: "images_detail",
  });

  const onSubmit = async (values: MarathonEditFormValues) => {
    setIsSubmitting(true);
    try {
      const result = await marathonEditAction(values);
      if (!result.success || !result.marathon) {
        throw new Error(result.message ?? "수정 중 오류가 발생했습니다.");
      }

      toast.success("마라톤 대회가 수정되었습니다.");
      onUpdated(result.marathon);
      onOpenChange(false);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "수정 중 오류가 발생했습니다.";
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!marathon?.id) return;
    if (
      !window.confirm(
        `"${marathon.name ?? "이 대회"}"를 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.`,
      )
    ) {
      return;
    }
    setIsDeleting(true);
    try {
      const result = await marathonDeleteAction(marathon.id);
      if (!result.success) {
        throw new Error(result.message ?? "삭제 중 오류가 발생했습니다.");
      }
      toast.success("마라톤 대회가 삭제되었습니다.");
      onDeleted?.(marathon);
      onOpenChange(false);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "삭제 중 오류가 발생했습니다.";
      toast.error(message);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[640px]">
        <DialogHeader className="border-b pb-4">
          <DialogTitle className="font-paperlogy text-brand">
            마라톤 수정하기
          </DialogTitle>
          <DialogDescription>
            마라톤 대회 정보를 수정하는 다이얼로그입니다.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            {/* 대회 정보 */}
            <div className="border-b border-dashed space-y-4 pb-6 mb-6">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        대회명 <span className="star">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input {...field} value={field.value ?? ""} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="slug"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        슬러그 <span className="star">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input {...field} value={field.value ?? ""} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div>
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        설명 <span className="star">*</span>
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          {...field}
                          value={field.value ?? ""}
                          rows={4}
                          className="resize-none"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* 대회 시작 날짜 및 시간 */}
            <div className="border-b border-dashed space-y-4 pb-6 mb-6">
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="event_start_date"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        대회 시작 날짜 <span className="star">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="date"
                          {...field}
                          value={field.value ?? ""}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="event_start_time"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>대회 시작 시간</FormLabel>
                      <FormControl>
                        <Input
                          type="time"
                          {...field}
                          value={field.value ?? ""}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="event_end_date"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>대회 종료 날짜</FormLabel>
                      <FormControl>
                        <Input
                          type="date"
                          {...field}
                          value={field.value ?? ""}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="event_end_time"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>대회 종료 시간 (선택)</FormLabel>
                      <FormControl>
                        <Input
                          type="time"
                          {...field}
                          value={field.value ?? ""}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="event_type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        이벤트 타입 <span className="star">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          value={field.value ?? ""}
                          placeholder="예) 마라톤 / 걷기 / 트레일"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="event_scale"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>이벤트 규모</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min={0}
                          {...field}
                          value={field.value ?? ""}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div>
                <FormField
                  control={form.control}
                  name="event_site"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>이벤트 사이트</FormLabel>
                      <FormControl>
                        <Input
                          type="url"
                          {...field}
                          value={field.value ?? ""}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* 접수 시작 날짜 및 시간 */}
            <div className="border-b border-dashed space-y-4 pb-6 mb-6">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <FormField
                  control={form.control}
                  name="registration_status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        접수 상태 선택 <span className="star">*</span>
                      </FormLabel>
                      <FormControl>
                        <Select
                          value={field.value ?? "접수중"}
                          onValueChange={field.onChange}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="상태를 선택하세요" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="접수대기">접수대기</SelectItem>
                            <SelectItem value="접수중">접수중</SelectItem>
                            <SelectItem value="추가접수">추가접수</SelectItem>
                            <SelectItem value="접수마감">접수마감</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="registration_site"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>접수사이트</FormLabel>
                      <FormControl>
                        <Input
                          type="url"
                          {...field}
                          value={field.value ?? ""}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <FormField
                  control={form.control}
                  name="registration_start_date"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>접수 시작일시</FormLabel>
                      <FormControl>
                        <Input
                          type="date"
                          {...field}
                          value={field.value ?? ""}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="registration_start_time"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>접수 시작시간</FormLabel>
                      <FormControl>
                        <Input
                          type="time"
                          {...field}
                          value={field.value ?? ""}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <FormField
                  control={form.control}
                  name="registration_end_date"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>접수 마감일시</FormLabel>
                      <FormControl>
                        <Input
                          type="date"
                          {...field}
                          value={field.value ?? ""}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="registration_end_time"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>접수 마감시간</FormLabel>
                      <FormControl>
                        <Input
                          type="time"
                          {...field}
                          value={field.value ?? ""}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <FormField
                  control={form.control}
                  name="registration_add_start_date"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>추가 접수 시작일시</FormLabel>
                      <FormControl>
                        <Input
                          type="date"
                          {...field}
                          value={field.value ?? ""}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="registration_add_start_time"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>추가 접수 시작시간</FormLabel>
                      <FormControl>
                        <Input
                          type="time"
                          {...field}
                          value={field.value ?? ""}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <FormField
                  control={form.control}
                  name="registration_add_end_date"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>추가 접수 마감일시</FormLabel>
                      <FormControl>
                        <Input
                          type="date"
                          {...field}
                          value={field.value ?? ""}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="registration_add_end_time"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>추가 접수 마감시간</FormLabel>
                      <FormControl>
                        <Input
                          type="time"
                          {...field}
                          value={field.value ?? ""}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="space-y-2">
                <FormLabel>접수가격</FormLabel>
                {pricesFieldArray.fields.map((fieldItem, index) => {
                  const isLastRow =
                    index === pricesFieldArray.fields.length - 1;
                  return (
                    <div
                      key={fieldItem.id}
                      className="flex w-full items-center gap-4"
                    >
                      <FormField
                        control={form.control}
                        name={`registration_prices.${index}.distance`}
                        render={({ field }) => (
                          <FormItem className="w-full">
                            <FormControl>
                              <Input
                                className="w-full"
                                placeholder="거리 (예: 10K)"
                                type="text"
                                {...field}
                                value={field.value ?? ""}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name={`registration_prices.${index}.price`}
                        render={({ field }) => (
                          <FormItem className="w-full">
                            <FormControl>
                              <Input
                                className="w-full"
                                placeholder="가격 (예: 50000)"
                                type="number"
                                min={0}
                                {...field}
                                value={field.value ?? ""}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                      {isLastRow ? (
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          onClick={() =>
                            pricesFieldArray.append({ distance: "", price: "" })
                          }
                          aria-label="접수가격 추가"
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      ) : (
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          onClick={() => pricesFieldArray.remove(index)}
                          aria-label="접수가격 삭제"
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 위치 정보 */}
            <div className="border-b border-dashed space-y-4 pb-6 mb-6">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <FormField
                  control={form.control}
                  name="location_country"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        나라 <span className="star">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input {...field} value={field.value ?? ""} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="location_region"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        지역 <span className="star">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input {...field} value={field.value ?? ""} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="location_place"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>장소</FormLabel>
                      <FormControl>
                        <Input {...field} value={field.value ?? ""} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <FormField
                  control={form.control}
                  name="location_lat"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>위도</FormLabel>
                      <FormControl>
                        <Input {...field} value={field.value ?? ""} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="location_lng"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>경도</FormLabel>
                      <FormControl>
                        <Input {...field} value={field.value ?? ""} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* 이미지 정보 */}
            <div className="border-b border-dashed space-y-3 pb-6 mb-6">
              {coverImagesFieldArray.fields.map((fieldItem, index) => {
                const isLastRow =
                  index === coverImagesFieldArray.fields.length - 1;
                return (
                  <div key={fieldItem.id} className="flex items-center gap-2">
                    <div className="w-24 shrink-0 text-sm font-anyvid text-muted-foreground">
                      커버 이미지
                    </div>
                    <FormField
                      control={form.control}
                      name={`images_cover.${index}.src`}
                      render={({ field }) => (
                        <FormItem className="w-full">
                          <FormControl>
                            <Input {...field} value={field.value ?? ""} />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    {isLastRow ? (
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={() =>
                          coverImagesFieldArray.append({ src: "" })
                        }
                        aria-label="커버 이미지 추가"
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    ) : (
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={() => coverImagesFieldArray.remove(index)}
                        aria-label="커버 이미지 삭제"
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                );
              })}

              {medalImagesFieldArray.fields.map((fieldItem, index) => {
                const isLastRow =
                  index === medalImagesFieldArray.fields.length - 1;
                return (
                  <div key={fieldItem.id} className="flex items-center gap-2">
                    <div className="w-24 shrink-0 text-sm font-anyvid text-muted-foreground">
                      메달 이미지
                    </div>
                    <FormField
                      control={form.control}
                      name={`images_medal.${index}.src`}
                      render={({ field }) => (
                        <FormItem className="w-full">
                          <FormControl>
                            <Input {...field} value={field.value ?? ""} />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    {isLastRow ? (
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={() =>
                          medalImagesFieldArray.append({ src: "" })
                        }
                        aria-label="메달 이미지 추가"
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    ) : (
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={() => medalImagesFieldArray.remove(index)}
                        aria-label="메달 이미지 삭제"
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                );
              })}

              {souvenirImagesFieldArray.fields.map((fieldItem, index) => {
                const isLastRow =
                  index === souvenirImagesFieldArray.fields.length - 1;
                return (
                  <div key={fieldItem.id} className="flex items-center gap-2">
                    <div className="w-24 shrink-0 text-sm font-anyvid text-muted-foreground">
                      기념품 이미지
                    </div>
                    <FormField
                      control={form.control}
                      name={`images_souvenir.${index}.src`}
                      render={({ field }) => (
                        <FormItem className="w-full">
                          <FormControl>
                            <Input {...field} value={field.value ?? ""} />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    {isLastRow ? (
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={() =>
                          souvenirImagesFieldArray.append({ src: "" })
                        }
                        aria-label="기념품 이미지 추가"
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    ) : (
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={() => souvenirImagesFieldArray.remove(index)}
                        aria-label="기념품 이미지 삭제"
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                );
              })}

              {detailImagesFieldArray.fields.map((fieldItem, index) => {
                const isLastRow =
                  index === detailImagesFieldArray.fields.length - 1;
                return (
                  <div key={fieldItem.id} className="flex items-center gap-2">
                    <div className="w-24 shrink-0 text-sm font-anyvid text-muted-foreground">
                      디테일 이미지
                    </div>
                    <FormField
                      control={form.control}
                      name={`images_detail.${index}.src`}
                      render={({ field }) => (
                        <FormItem className="w-full">
                          <FormControl>
                            <Input {...field} value={field.value ?? ""} />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    {isLastRow ? (
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={() =>
                          detailImagesFieldArray.append({ src: "" })
                        }
                        aria-label="디테일 이미지 추가"
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    ) : (
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={() => detailImagesFieldArray.remove(index)}
                        aria-label="디테일 이미지 삭제"
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                );
              })}
            </div>

            {/* 주최자 정보 */}
            <div className="border-b border-dashed space-y-3 pb-6 mb-6">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <FormField
                  control={form.control}
                  name="host_organizer"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>주최</FormLabel>
                      <FormControl>
                        <Input {...field} value={field.value ?? ""} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="host_manage"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>주관</FormLabel>
                      <FormControl>
                        <Input {...field} value={field.value ?? ""} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div>
                <FormField
                  control={form.control}
                  name="host_sponsor"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>후원</FormLabel>
                      <FormControl>
                        <Input {...field} value={field.value ?? ""} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div>
                <FormField
                  control={form.control}
                  name="host_souvenir"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>기념품</FormLabel>
                      <FormControl>
                        <Input {...field} value={field.value ?? ""} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <FormField
                  control={form.control}
                  name="host_phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>전화번호</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          value={field.value ?? ""}
                          type="tel"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="host_email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>이메일</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          value={field.value ?? ""}
                          type="email"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* SNS 정보 */}
            <div className="border-b border-dashed space-y-3 pb-6 mb-6">
              <FormField
                control={form.control}
                name="sns_kakao"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>카카오 주소</FormLabel>
                    <FormControl>
                      <Input {...field} value={field.value ?? ""} type="url" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="sns_instagram"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>인스타그램 주소</FormLabel>
                    <FormControl>
                      <Input {...field} value={field.value ?? ""} type="url" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="sns_blog"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>블로그 주소</FormLabel>
                    <FormControl>
                      <Input {...field} value={field.value ?? ""} type="url" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="sns_youtube"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>유튜브 주소</FormLabel>
                    <FormControl>
                      <Input {...field} value={field.value ?? ""} type="url" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <DialogFooter className="gap-2 mt-6 flex-row flex-wrap sm:justify-between">
              <Button
                type="button"
                variant="outline"
                onClick={handleDelete}
                disabled={isSubmitting || isDeleting || !marathon?.id}
                className="mr-auto"
              >
                {isDeleting ? "삭제 중..." : "삭제"}
              </Button>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => onOpenChange(false)}
                  disabled={isSubmitting || isDeleting}
                >
                  취소
                </Button>
                <Button
                  type="submit"
                  className="bg-brand text-white hover:bg-brand/90"
                  disabled={isSubmitting || isDeleting}
                >
                  {isSubmitting ? "수정 중..." : "수정"}
                </Button>
              </div>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
