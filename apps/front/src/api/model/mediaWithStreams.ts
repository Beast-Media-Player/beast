/**
 * Generated by otqs v1.0.0 🍺
 * Do not edit manually.
 * @beast/backend
 * OpenAPI spec version: 0.0.1
 */
import type { MediaWithStreamsStreamsItem } from "./mediaWithStreamsStreamsItem";

export interface MediaWithStreams {
  bitrate: number;
  createdAt: string;
  duration: number;
  height: number;
  id: string;
  libraryId: string;
  path: string;
  streams: MediaWithStreamsStreamsItem[];
  width: number;
}