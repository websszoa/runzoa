"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Textarea } from "@/components/ui/textarea";
import { marathonAddSchema } from "@/lib/validations";
import { Marathon, MarathonAddFormValues } from "@/lib/types";
import { marathonAddAction } from "@/lib/actions/marathon-add";
import { Minus, Plus } from "lucide-react";
import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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

type DialogMarathonAddProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onMarathonAdded?: (addedMarathon: Marathon) => void;
};

const marathonAddValues: MarathonAddFormValues = {
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

function DialogMarathonAdd({
  open,
  onOpenChange,
  onMarathonAdded,
}: DialogMarathonAddProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<MarathonAddFormValues>({
    resolver: zodResolver(marathonAddSchema),
    defaultValues: marathonAddValues,
  });

  // 다이얼로그 열릴 때마다 폼 초기화
  useEffect(() => {
    if (open) {
      form.reset(marathonAddValues);
    }
  }, [open, form]);

  const onSubmit = async (values: MarathonAddFormValues) => {
    setIsSubmitting(true);

    try {
      const result = await marathonAddAction(values);

      if (!result.success) {
        throw new Error(result.message ?? "등록 중 오류가 발생했습니다.");
      }

      toast.success("마라톤 대회가 등록되었습니다.");
      form.reset(marathonAddValues);
      onOpenChange(false);
      if (result.marathon) {
        onMarathonAdded?.(result.marathon);
      }
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "등록 중 오류가 발생했습니다.";
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // 접수 가격 필드
  const pricesFieldArray = useFieldArray({
    control: form.control,
    name: "registration_prices",
  });

  // 접수 가격 추가
  const addPriceRow = () => {
    pricesFieldArray.append({ distance: "", price: "" });
  };

  // 접수 가격 삭제
  const removePriceRow = (index: number) => {
    if (pricesFieldArray.fields.length === 1) return;
    pricesFieldArray.remove(index);
  };

  // 커버 이미지 필드
  const coverImagesFieldArray = useFieldArray({
    control: form.control,
    name: "images_cover",
  });

  // 메달 이미지 필드
  const medalImagesFieldArray = useFieldArray({
    control: form.control,
    name: "images_medal",
  });

  // 기념품 이미지 필드
  const souvenirImagesFieldArray = useFieldArray({
    control: form.control,
    name: "images_souvenir",
  });

  // 디테일 이미지 필드
  const detailImagesFieldArray = useFieldArray({
    control: form.control,
    name: "images_detail",
  });

  // 커버 이미지 추가
  const addCoverImageRow = () => {
    coverImagesFieldArray.append({ src: "" });
  };
  const removeCoverImageRow = (index: number) => {
    if (coverImagesFieldArray.fields.length === 1) return;
    coverImagesFieldArray.remove(index);
  };

  // 메달 이미지 추가
  const addMedalImageRow = () => {
    medalImagesFieldArray.append({ src: "" });
  };
  const removeMedalImageRow = (index: number) => {
    if (medalImagesFieldArray.fields.length === 1) return;
    medalImagesFieldArray.remove(index);
  };

  // 기념품 이미지 추가
  const addSouvenirImageRow = () => {
    souvenirImagesFieldArray.append({ src: "" });
  };
  const removeSouvenirImageRow = (index: number) => {
    if (souvenirImagesFieldArray.fields.length === 1) return;
    souvenirImagesFieldArray.remove(index);
  };

  // 디테일 이미지 추가
  const addDetailImageRow = () => {
    detailImagesFieldArray.append({ src: "" });
  };
  const removeDetailImageRow = (index: number) => {
    if (detailImagesFieldArray.fields.length === 1) return;
    detailImagesFieldArray.remove(index);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[640px]">
        <DialogHeader className="border-b pb-4">
          <DialogTitle className="font-paperlogy text-brand">
            마라톤 추가하기
          </DialogTitle>
          <DialogDescription>
            마라톤 대회 정보를 입력하고 등록하는 다이얼로그입니다.
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
                          defaultValue="접수중"
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
                          onClick={addPriceRow}
                          aria-label="접수가격 추가"
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      ) : (
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          onClick={() => removePriceRow(index)}
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
                        onClick={addCoverImageRow}
                        aria-label="커버 이미지 추가"
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    ) : (
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={() => removeCoverImageRow(index)}
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
                        onClick={addMedalImageRow}
                        aria-label="메달 이미지 추가"
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    ) : (
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={() => removeMedalImageRow(index)}
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
                        onClick={addSouvenirImageRow}
                        aria-label="기념품 이미지 추가"
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    ) : (
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={() => removeSouvenirImageRow(index)}
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
                        onClick={addDetailImageRow}
                        aria-label="디테일 이미지 추가"
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    ) : (
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={() => removeDetailImageRow(index)}
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

            <DialogFooter className="gap-2 mt-6">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isSubmitting}
              >
                취소
              </Button>
              <Button
                type="submit"
                className="bg-brand text-white hover:bg-brand/90"
                disabled={isSubmitting}
              >
                {isSubmitting ? "등록 중..." : "등록"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

export default DialogMarathonAdd;
