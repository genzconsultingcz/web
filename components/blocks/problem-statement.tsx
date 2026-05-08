'use client';
import React from 'react';
import type { Template } from 'tinacms';
import { tinaField } from 'tinacms/dist/react';
import { Section } from '../layout/section';
import { TinaMarkdown } from 'tinacms/dist/rich-text';

export const ProblemStatement = ({ data }: { data: any }) => {
  return (
    <Section background={data.background ?? 'bg-gtc-deep'}>
      <div className="mx-auto max-w-6xl">
        {data.eyebrow && (
          <p
            className="mb-6 text-sm font-semibold uppercase tracking-widest text-gtc-primary"
            data-tina-field={tinaField(data, 'eyebrow')}
          >
            {data.eyebrow}
          </p>
        )}

        <div className="grid gap-12 lg:grid-cols-2 lg:gap-20">
          <div
            className="prose prose-invert max-w-none"
            data-tina-field={tinaField(data, 'problem')}
          >
            {data.problem && <TinaMarkdown content={data.problem} />}
          </div>
          <div
            className="prose prose-invert max-w-none"
            data-tina-field={tinaField(data, 'solution')}
          >
            {data.solution && <TinaMarkdown content={data.solution} />}
          </div>
        </div>

        {data.quote && (
          <blockquote
            className="mt-16 border-l-4 border-gtc-primary pl-6 text-2xl font-semibold italic text-white"
            data-tina-field={tinaField(data, 'quote')}
          >
            {data.quote}
          </blockquote>
        )}
      </div>
    </Section>
  );
};

export const problemStatementBlockSchema: Template = {
  name: 'problemStatement',
  label: 'Problem Statement',
  ui: {
    defaultItem: {
      eyebrow: 'Proč to nefunguje',
      background: 'bg-gtc-deep',
    },
  },
  fields: [
    { type: 'string', label: 'Background', name: 'background' },
    { type: 'string', label: 'Eyebrow Label', name: 'eyebrow' },
    {
      type: 'rich-text',
      label: 'Problem (left column)',
      name: 'problem',
    },
    {
      type: 'rich-text',
      label: 'Solution (right column)',
      name: 'solution',
    },
    {
      type: 'string',
      label: 'Pull Quote',
      name: 'quote',
      ui: { component: 'textarea' },
    },
  ],
};
