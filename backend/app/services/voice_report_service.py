from .ai_service import (
    generate_structured_incident_report,
    transcribe_audio,
    translate_report,
)


class VoiceReportService:
    def __init__(self, store):
        self.store = store

    def enqueue_processing(self, report: dict):
        return f"job_{report['id']}"

    def build_stub_preview(self, report: dict):
        transcript = transcribe_audio(report.get("audio_url", ""), report["language"])
        translation = translate_report(transcript["transcript"], report["language"])
        structured = generate_structured_incident_report(
            transcript["transcript"],
            translation["translation"],
            report.get("zone_name", ""),
        )
        return transcript, translation, structured
