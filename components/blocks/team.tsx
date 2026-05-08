'use client';
import React from 'react';
import Image from 'next/image';
import type { Template } from 'tinacms';
import { tinaField } from 'tinacms/dist/react';
import { Section } from '../layout/section';
import { FaLinkedin } from 'react-icons/fa6';

export const Team = ({ data }: { data: any }) => {
  const core = data.members?.filter((m: any) => !m?.isMentor) ?? [];
  const mentors = data.members?.filter((m: any) => m?.isMentor) ?? [];

  return (
    <Section id="team" background={data.background ?? ''}>
      <div className="mx-auto max-w-6xl">
        {data.title && (
          <h2
            className="mb-4 text-balance text-4xl font-bold lg:text-5xl"
            data-tina-field={tinaField(data, 'title')}
          >
            {data.title}
          </h2>
        )}
        {data.description && (
          <p
            className="mb-12 max-w-2xl text-muted-foreground"
            data-tina-field={tinaField(data, 'description')}
          >
            {data.description}
          </p>
        )}

        {/* Core team */}
        <div className="grid gap-8 sm:grid-cols-2">
          {core.map((member: any, i: number) => (
            <div
              key={i}
              className="group flex flex-col gap-4 rounded-2xl border border-border bg-card p-6"
              data-tina-field={tinaField(member)}
            >
              {member?.photo && (
                <Image
                  src={member.photo}
                  alt={member.name ?? ''}
                  width={120}
                  height={120}
                  className="h-28 w-28 rounded-full object-cover grayscale transition-all duration-300 group-hover:grayscale-0"
                />
              )}
              <div>
                <p className="text-lg font-semibold">{member?.name}</p>
                <p className="text-sm text-muted-foreground">{member?.role}</p>
                {member?.bio && <p className="mt-2 text-sm">{member.bio}</p>}
                {member?.linkedin && (
                  <a
                    href={member.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-gtc-dark hover:text-gtc-primary"
                  >
                    <FaLinkedin className="size-4" /> LinkedIn
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Mentors */}
        {mentors.length > 0 && (
          <div className="mt-16">
            <h3 className="mb-8 text-xl font-semibold text-muted-foreground">Mentoři a partneři</h3>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
              {mentors.map((mentor: any, i: number) => (
                <div
                  key={i}
                  className="flex flex-col items-center gap-2 rounded-xl border border-border p-4 text-center"
                  data-tina-field={tinaField(mentor)}
                >
                  {mentor?.photo && (
                    <Image
                      src={mentor.photo}
                      alt={mentor.name ?? ''}
                      width={64}
                      height={64}
                      className="h-16 w-16 rounded-full object-cover grayscale"
                    />
                  )}
                  <p className="text-sm font-semibold">{mentor?.name}</p>
                  <p className="text-xs text-muted-foreground">{mentor?.role}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </Section>
  );
};

export const teamBlockSchema: Template = {
  name: 'team',
  label: 'Team',
  ui: {
    defaultItem: {
      title: 'Náš tým',
      description: 'Lidé za GenZ Consulting.',
    },
  },
  fields: [
    { type: 'string', label: 'Background', name: 'background' },
    { type: 'string', label: 'Title', name: 'title' },
    {
      type: 'string',
      label: 'Description',
      name: 'description',
      ui: { component: 'textarea' },
    },
    {
      type: 'object',
      label: 'Members',
      name: 'members',
      list: true,
      ui: {
        itemProps: (item) => ({ label: item?.name || 'Member' }),
        defaultItem: { name: 'Jméno', role: 'Role', isMentor: false },
      },
      fields: [
        { type: 'string', label: 'Name', name: 'name' },
        { type: 'string', label: 'Role', name: 'role' },
        { type: 'string', label: 'Bio', name: 'bio', ui: { component: 'textarea' } },
        { type: 'image', label: 'Photo', name: 'photo' },
        { type: 'string', label: 'LinkedIn URL', name: 'linkedin' },
        { type: 'boolean', label: 'Is Mentor', name: 'isMentor' },
      ],
    },
  ],
};
