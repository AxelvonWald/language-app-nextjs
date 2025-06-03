// app/courses/[id]/modules/[moduleId]/lessons/[lesson_id]/page.jsx
"use client";

import { supabase } from "@/lib/supabase";
import { useEffect, useState } from "react";
import BackButton from "@/components/BackButton";
import AudioPlayer from "@/components/AudioPlayer";
import LessonLock from "@/components/LessonLock";

export default function LessonPage({ params }) {
  const { id: courseId, moduleId, lesson_id } = params;
  const [lesson, setLesson] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // 1. Get user session
        const {
          data: { user },
        } = await supabase.auth.getUser();
        setUser(user);

        // 2. Fetch lesson with separate queries for better control
        const { data: lessonData, error: lessonError } = await supabase
          .from("lessons")
          .select("*")
          .eq("id", lesson_id)
          .single();

        if (lessonError) throw lessonError;
        if (!lessonData) throw new Error("Lesson not found");

        // 3. Fetch sections separately
        const { data: sections, error: sectionsError } = await supabase
          .from("lesson_sections")
          .select("*")
          .eq("lesson_id", lesson_id)
          .order("order_index", { ascending: true });

        if (sectionsError) throw sectionsError;

        // 4. Fetch all related data in parallel
        const sectionData = await Promise.all(
          sections.map(async (section) => {
            // Get sentences for this section
            const { data: sentencesData } = await supabase
              .from("section_sentences")
              .select("sentences(*)")
              .eq("lesson_section_id", section.id);

            // Get audio for this section
            const { data: audioData } = await supabase
              .from("audio_files")
              .select("file_path")
              .eq("lesson_section_id", section.id)
              .maybeSingle(); // Use maybeSingle since audio might be optional

            return {
              ...section,
              sentences: sentencesData?.map((ss) => ss.sentences) || [],
              audioPath: audioData?.file_path,
            };
          })
        );

        setLesson({
          ...lessonData,
          sections: sectionData,
        });
      } catch (err) {
        console.error("Failed to load lesson:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [courseId, moduleId, lesson_id]);

  if (loading)
    return (
      <main className="container">
        <p>Loading lesson...</p>
      </main>
    );

  if (error)
    return (
      <main className="container">
        <BackButton
          href={`/courses/${courseId}/modules/${moduleId}/lessons`}
          className="mb-6"
        >
          Back to Lessons
        </BackButton>
        <div className="text-red-500 p-4 border border-red-200 bg-red-50 rounded">
          Error: {error}
        </div>
      </main>
    );

  if (!lesson)
    return (
      <main className="container">
        <BackButton
          href={`/courses/${courseId}/modules/${moduleId}/lessons`}
          className="mb-6"
        >
          Back to Lessons
        </BackButton>
        <p>Lesson not found</p>
      </main>
    );

  return (
    <main className="container">
      <BackButton
        href={`/courses/${courseId}/modules/${moduleId}/lessons`}
        className="mb-6"
      >
        Back to Lessons
      </BackButton>

      <LessonLock
        courseId={courseId}
        moduleId={moduleId}
        lessonId={lesson_id}
        userId={user?.id}
      />

      <h1 className="text-3xl font-bold mb-2">{lesson.title}</h1>
      {lesson.description && (
        <p className="text-gray-600 mb-8">{lesson.description}</p>
      )}

      <div className="space-y-8">
        {lesson.sections.map((section) => (
          <section
            key={section.id}
            className="p-6 bg-white rounded-lg border border-gray-200"
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <h2 className="text-xl font-semibold">{section.title}</h2>
                {section.instructions && (
                  <p className="text-gray-600 mt-1">{section.instructions}</p>
                )}
              </div>
              {section.repetitions > 0 && (
                <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                  Repeat {section.repetitions}x
                </span>
              )}
            </div>

            {section.audioPath && (
              <AudioPlayer
                path={section.audioPath}
                label={`${section.title} Audio`}
              />
            )}

            {section.sentences.length > 0 && (
              <table className="w-full mt-6 border-collapse">
                <thead>
                  <tr className="border-b-2 border-gray-200">
                    <th className="text-left pb-3 font-semibold">Native</th>
                    <th className="text-left pb-3 font-semibold">Target</th>
                  </tr>
                </thead>
                <tbody>
                  {section.sentences.map((sentence) => (
                    <tr
                      key={sentence.id}
                      className="border-b border-gray-200 hover:bg-gray-50"
                    >
                      <td className="py-4 font-medium">
                        {sentence.native_text}
                      </td>
                      <td className="py-4">{sentence.target_text}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </section>
        ))}
      </div>
    </main>
  );
}
