"use client";

import { Mic, Square } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { clientMutation } from "@/lib/api";
import { languageOptions } from "@/lib/constants";
import type { Zone } from "@/types";

const workerReportSchema = z.object({
  employee_id: z.string().optional(),
  zone_id: z.string().min(1, "Select a zone"),
  language: z.string().min(1, "Select a language")
});

type WorkerReportValues = z.infer<typeof workerReportSchema>;

export function WorkerReportForm({ zones }: { zones: Zone[] }) {
  const [recording, setRecording] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [submitMessage, setSubmitMessage] = useState("");
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
    setValue
  } = useForm<WorkerReportValues>({
    resolver: zodResolver(workerReportSchema),
    defaultValues: {
      employee_id: "",
      zone_id: zones[0]?.id ?? "",
      language: languageOptions[0]?.value ?? "हिन्दी"
    }
  });

  useEffect(() => {
    if (!recording) {
      return;
    }
    const timer = window.setInterval(() => setSeconds((value) => value + 1), 1000);
    return () => window.clearInterval(timer);
  }, [recording]);

  async function startRecording() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      chunksRef.current = [];
      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };
      recorder.onstop = () => {
        setAudioBlob(new Blob(chunksRef.current, { type: "audio/webm" }));
        stream.getTracks().forEach((track) => track.stop());
      };
      mediaRecorderRef.current = recorder;
      recorder.start();
      setSeconds(0);
      setRecording(true);
    } catch {
      setSubmitMessage("Microphone access was blocked. Please allow audio recording and try again.");
    }
  }

  function stopRecording() {
    mediaRecorderRef.current?.stop();
    setRecording(false);
  }

  async function onSubmit(values: WorkerReportValues) {
    if (!audioBlob) {
      setSubmitMessage("Please record your complaint before submitting.");
      return;
    }

    const fallbackReport = {
      id: `report-${Date.now()}`,
      employee_id: values.employee_id,
      zone_id: values.zone_id,
      language: values.language,
      audio_media_id: "pending-upload",
      transcript: "Processing...",
      translation: "Processing...",
      structured_report: "Processing...",
      status: "processing",
      celery_job_id: "local-fallback-job",
      created_at: new Date().toISOString()
    };

    const response = await clientMutation("post", "/reports", fallbackReport, fallbackReport);
    setSubmitMessage(response.message || "Complaint submitted. Transcript and English report will appear after processing.");
    setAudioBlob(null);
    setSeconds(0);
    setValue("employee_id", "");
  }

  return (
    <div className="space-y-5">
      <Card className="space-y-4">
        <div className="space-y-1">
          <p className="section-title">Worker complaint</p>
          <CardTitle>Record in your language</CardTitle>
          <CardDescription>Speak naturally. The admin team will later get transcript, English translation, and structured report.</CardDescription>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-ink">Worker ID or name</label>
            <Input placeholder="Optional" {...register("employee_id")} />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium text-ink">Zone</label>
              <Controller
                control={control}
                name="zone_id"
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select zone" />
                    </SelectTrigger>
                    <SelectContent>
                      {zones.map((zone) => (
                        <SelectItem key={zone.id} value={zone.id}>
                          {zone.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.zone_id ? <p className="text-sm text-red-600">{errors.zone_id.message}</p> : null}
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-ink">Language</label>
              <Controller
                control={control}
                name="language"
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select language" />
                    </SelectTrigger>
                    <SelectContent>
                      {languageOptions.map((language) => (
                        <SelectItem key={language.value} value={language.value}>
                          {language.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.language ? <p className="text-sm text-red-600">{errors.language.message}</p> : null}
            </div>
          </div>

          <div className="rounded-[1.6rem] border border-[var(--border)] bg-white/80 p-5 text-center">
            <div className="mx-auto mb-4 flex h-24 w-24 items-center justify-center rounded-full bg-ember/10">
              {recording ? <Square className="h-10 w-10 text-ember" /> : <Mic className="h-10 w-10 text-ember" />}
            </div>
            <p className="text-2xl font-semibold text-ink">{seconds}s</p>
            <p className="mt-1 text-sm text-slate">
              {recording
                ? "Recording in progress. Tap stop when you are done."
                : audioBlob
                  ? "Recording ready to submit."
                  : "Tap record and speak clearly."}
            </p>
            <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:justify-center">
              {!recording ? (
                <Button type="button" variant="accent" className="sm:min-w-40" onClick={startRecording}>
                  <Mic className="mr-2 h-4 w-4" />
                  {audioBlob ? "Record again" : "Start recording"}
                </Button>
              ) : (
                <Button type="button" className="sm:min-w-40" onClick={stopRecording}>
                  <Square className="mr-2 h-4 w-4" />
                  Stop recording
                </Button>
              )}
              <Button type="submit" variant="outline" className="sm:min-w-40" disabled={isSubmitting}>
                {isSubmitting ? "Submitting..." : "Submit complaint"}
              </Button>
            </div>
          </div>
        </form>
      </Card>

      <Card className="space-y-3">
        <p className="section-title">Phase 2 placeholders</p>
        <div className="grid gap-3 sm:grid-cols-3">
          <div className="rounded-[1.2rem] border border-[var(--border)] bg-white/70 p-4">
            <p className="text-sm font-medium text-ink">Transcript</p>
            <p className="mt-2 text-sm text-slate">Processing...</p>
          </div>
          <div className="rounded-[1.2rem] border border-[var(--border)] bg-white/70 p-4">
            <p className="text-sm font-medium text-ink">English translation</p>
            <p className="mt-2 text-sm text-slate">Processing...</p>
          </div>
          <div className="rounded-[1.2rem] border border-[var(--border)] bg-white/70 p-4">
            <p className="text-sm font-medium text-ink">Structured incident report</p>
            <p className="mt-2 text-sm text-slate">Processing...</p>
          </div>
        </div>
      </Card>

      {submitMessage ? <p className="text-sm text-slate">{submitMessage}</p> : null}
    </div>
  );
}
