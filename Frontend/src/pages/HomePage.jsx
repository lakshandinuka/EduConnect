import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

import ToggleSwitch from '../components/common/ToggleSwitch';
import { useAuth } from '../context/AuthContext';
import { getPageContent, updatePageContent } from '../services/pageService';
import { useToast, ToastContainer } from '../components/common/Toast';

const defaultHome = {
  hero: {
    title: 'SFS EDUCONNECT',
    subtitle:
      'Find answers fast — courses, payments, LMS access, certificates, and student services.',
    imageSrc: '/assets/hero-campus.jpg',
  },
  about: {
    eyebrow: 'About SFS Academy',
    title: 'About SFS Academy',
    body:
      'SFS Academy supports learners with industry-ready training and higher-education pathways. Use EDUCONNECT to access self-help articles, FAQs, and guidance from our help desk team.',
    linkLabel: 'Read More',
  },
  mission: {
    title: 'Our Mission',
    body:
      'To provide learner-centered education and research that empowers our youth to forge a better world.',
  },
  contact: {
    title: 'Contact Information',
    subtitle: 'How to get in touch with us.',
    phoneLabel: 'Phone Number',
    phone: '+94 77 326 1026',
    emailLabel: 'Email Address',
    email: 'info@sfsacademy.lk',
    addressLabel: 'Mailing Address',
    address: '260/24A, Depot Road, Katubedda, Moratuwa, Sri Lanka.',
    secondaryAddressLabel: 'Colombo Branch',
    secondaryAddress: '292/2/1, Galle Road, Colombo 04, Sri Lanka.',
    helpDeskTitle: 'Contact Help Desk',
    submitTicketLabel: 'Submit a Ticket',
  },
  images: {
    aboutLeft: '/assets/building.jpg',
    strip: '/assets/library.jpg',
  },
};

function Field({ label, children }) {
  return (
    <label className="block">
      <span className="text-xs font-bold uppercase tracking-wide text-slate-500">
        {label}
      </span>
      <div className="mt-1">{children}</div>
    </label>
  );
}

export default function HomePage() {
  const { isAdmin, user } = useAuth();
  const navigate = useNavigate();
  const { toasts, showToast, removeToast } = useToast();

  const [content, setContent] = useState(defaultHome);
  const [draft, setDraft] = useState(defaultHome);
  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const data = await getPageContent('home');
        if (data?.contentJson) {
          const parsed = JSON.parse(data.contentJson);
          const merged = { ...defaultHome, ...parsed };
          setContent(merged);
          setDraft(merged);
        }
      } catch {
        setContent(defaultHome);
        setDraft(defaultHome);
      }
    })();
  }, []);

  const handleSave = async () => {
    try {
      await updatePageContent('home', draft);
      setContent(draft);
      setEditMode(false);
      showToast('Home page updated', 'success');
    } catch {
      showToast('Failed to save changes', 'error');
    }
  };

  const handleSubmitTicket = () => {
    if (user) {
      navigate('/create-ticket');
      return;
    }
    navigate('/login', { state: { from: '/create-ticket' } });
  };

  const canEdit = Boolean(isAdmin);

  return (
    <div className="min-h-screen bg-white text-sfs-ink">

      {/* Admin edit bar */}
      {canEdit && (
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3">
          <div className="flex items-center gap-3">
            <ToggleSwitch
              checked={editMode}
              onChange={setEditMode}
              onLabel="Edit"
              offLabel="Preview"
            />
            <span className="text-sm text-slate-600">
              {editMode ? 'Editing enabled' : 'Preview mode'}
            </span>
          </div>

          {editMode && (
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleSave}
                className="rounded-lg bg-sfs-blue px-4 py-2 text-sm font-semibold text-white hover:opacity-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-sfs-blue"
              >
                Save
              </button>
              <button
                type="button"
                onClick={() => {
                  setDraft(content);
                  setEditMode(false);
                }}
                className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-sfs-blue"
              >
                Cancel
              </button>
            </div>
          )}
        </div>
      )}

      {/* Hero */}
      <section className="relative">
        <div
          className="h-[70vh] min-h-[520px] w-full bg-cover bg-center"
          style={{ backgroundImage: `url(${(editMode ? draft.hero.imageSrc : content.hero.imageSrc)})` }}
          role="img"
          aria-label="Students on campus"
        >
          <div className="absolute inset-0 bg-black/35" />
          <div className="absolute inset-0">
            <div className="mx-auto flex h-full max-w-7xl items-center px-4">
              <div className="w-full">
                <div className="max-w-3xl">
                  {editMode ? (
                    <div className="grid gap-3">
                      <Field label="Hero title">
                        <input
                          value={draft.hero.title}
                          onChange={(e) =>
                            setDraft({ ...draft, hero: { ...draft.hero, title: e.target.value } })
                          }
                          className="w-full rounded-lg border border-white/25 bg-white/10 px-4 py-3 text-3xl font-extrabold text-white placeholder-white/70 outline-none focus:ring-2 focus:ring-white/40"
                        />
                      </Field>
                      <Field label="Hero subtitle">
                        <textarea
                          rows={3}
                          value={draft.hero.subtitle}
                          onChange={(e) =>
                            setDraft({ ...draft, hero: { ...draft.hero, subtitle: e.target.value } })
                          }
                          className="w-full rounded-lg border border-white/25 bg-white/10 px-4 py-3 text-base text-white placeholder-white/70 outline-none focus:ring-2 focus:ring-white/40"
                        />
                      </Field>
                      <div className="grid gap-3 sm:grid-cols-2">
                        <Field label="Hero image path">
                          <input
                            value={draft.hero.imageSrc}
                            onChange={(e) =>
                              setDraft({ ...draft, hero: { ...draft.hero, imageSrc: e.target.value } })
                            }
                            className="w-full rounded-lg border border-white/25 bg-white/10 px-3 py-2 text-sm font-semibold text-white outline-none focus:ring-2 focus:ring-white/40"
                          />
                        </Field>
                      </div>
                    </div>
                  ) : (
                    <>
                      <motion.h1
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.35 }}
                        className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl"
                      >
                        {content.hero.title}
                      </motion.h1>
                      <p className="mt-4 max-w-2xl text-base leading-relaxed text-white/90 sm:text-lg">
                        {content.hero.subtitle}
                      </p>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About split section */}
      <section id="about" className="bg-sfs-mist">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 md:grid-cols-2 md:items-stretch">
          <div className="overflow-hidden rounded-xl">
            <img
              src={content.images.aboutLeft}
              alt="Campus building"
              className="h-full w-full object-cover"
              loading="lazy"
            />
          </div>

          <div className="rounded-xl bg-white p-7 border border-slate-200">
            {editMode ? (
              <div className="grid gap-3">
                <Field label="About title">
                  <input
                    value={draft.about.title}
                    onChange={(e) =>
                      setDraft({ ...draft, about: { ...draft.about, title: e.target.value } })
                    }
                    className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xl font-extrabold text-sfs-ink outline-none focus:ring-2 focus:ring-sfs-blue"
                  />
                </Field>
                <Field label="About body">
                  <textarea
                    rows={6}
                    value={draft.about.body}
                    onChange={(e) =>
                      setDraft({ ...draft, about: { ...draft.about, body: e.target.value } })
                    }
                    className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 outline-none focus:ring-2 focus:ring-sfs-blue"
                  />
                </Field>
              </div>
            ) : (
              <>
                <p className="text-xs font-bold uppercase tracking-wide text-sfs-blue">
                  {content.about.eyebrow}
                </p>
                <h2 className="mt-2 text-2xl font-extrabold text-sfs-red">
                  {content.about.title}
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-slate-700">
                  {content.about.body}
                </p>
              </>
            )}

            <div className="mt-5">
              <button
                type="button"
                onClick={() => showToast('Read more (placeholder)', 'info')}
                className="inline-flex items-center rounded-lg px-0 text-sm font-bold text-sfs-red underline-offset-4 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-sfs-blue"
              >
                {content.about.linkLabel}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Mission */}
      <section className="bg-sfs-red">
        <div className="mx-auto max-w-7xl px-4 py-16 text-center">
          {editMode ? (
            <div className="mx-auto max-w-3xl space-y-3">
              <Field label="Mission title">
                <input
                  value={draft.mission.title}
                  onChange={(e) =>
                    setDraft({ ...draft, mission: { ...draft.mission, title: e.target.value } })
                  }
                  className="w-full rounded-lg border border-white/25 bg-white/10 px-3 py-2 text-2xl font-extrabold text-white outline-none focus:ring-2 focus:ring-white/50"
                />
              </Field>
              <Field label="Mission body">
                <textarea
                  rows={4}
                  value={draft.mission.body}
                  onChange={(e) =>
                    setDraft({ ...draft, mission: { ...draft.mission, body: e.target.value } })
                  }
                  className="w-full rounded-lg border border-white/25 bg-white/10 px-3 py-2 text-base text-white outline-none focus:ring-2 focus:ring-white/50"
                />
              </Field>
            </div>
          ) : (
            <>
              <h2 className="text-3xl font-extrabold text-white">{content.mission.title}</h2>
              <p className="mx-auto mt-6 max-w-3xl text-lg leading-relaxed text-white/95">
                {content.mission.body}
              </p>
            </>
          )}
        </div>
      </section>

      {/* Image strip */}
      <section className="bg-white">
        <img
          src={content.images.strip}
          alt="Library shelves"
          className="h-64 w-full object-cover sm:h-72"
          loading="lazy"
        />
      </section>

      {/* Contact */}
      <section className="bg-sfs-mist">
        <div className="mx-auto max-w-7xl px-4 py-12">
          {editMode ? (
            <div className="grid gap-3">
              <Field label="Contact title">
                <input
                  value={draft.contact.title}
                  onChange={(e) =>
                    setDraft({ ...draft, contact: { ...draft.contact, title: e.target.value } })
                  }
                  className="w-full max-w-xl rounded-lg border border-slate-200 px-3 py-2 text-2xl font-extrabold text-sfs-ink outline-none focus:ring-2 focus:ring-sfs-blue"
                />
              </Field>
              <Field label="Contact subtitle">
                <input
                  value={draft.contact.subtitle}
                  onChange={(e) =>
                    setDraft({ ...draft, contact: { ...draft.contact, subtitle: e.target.value } })
                  }
                  className="w-full max-w-xl rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-700 outline-none focus:ring-2 focus:ring-sfs-blue"
                />
              </Field>
            </div>
          ) : (
            <>
              <h2 className="text-3xl font-extrabold text-sfs-red">{content.contact.title}</h2>
              <p className="mt-2 text-sm text-slate-600">{content.contact.subtitle}</p>
            </>
          )}

          <div className="mt-8 grid gap-6 md:grid-cols-5">
            <div className="md:col-span-3 rounded-xl border border-slate-200 bg-white p-6">
              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <div className="text-xs font-bold uppercase tracking-wide text-slate-500">
                    {content.contact.phoneLabel}
                  </div>
                  {editMode ? (
                    <input
                      value={draft.contact.phone}
                      onChange={(e) =>
                        setDraft({ ...draft, contact: { ...draft.contact, phone: e.target.value } })
                      }
                      className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-700 outline-none focus:ring-2 focus:ring-sfs-blue"
                    />
                  ) : (
                    <a
                      href={`tel:${content.contact.phone}`}
                      className="mt-2 block text-sm font-semibold text-sfs-ink hover:text-sfs-blue"
                    >
                      {content.contact.phone}
                    </a>
                  )}
                </div>

                <div>
                  <div className="text-xs font-bold uppercase tracking-wide text-slate-500">
                    {content.contact.emailLabel}
                  </div>
                  {editMode ? (
                    <input
                      value={draft.contact.email}
                      onChange={(e) =>
                        setDraft({ ...draft, contact: { ...draft.contact, email: e.target.value } })
                      }
                      className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-700 outline-none focus:ring-2 focus:ring-sfs-blue"
                    />
                  ) : (
                    <a
                      href={`mailto:${content.contact.email}`}
                      className="mt-2 block text-sm font-semibold text-sfs-ink hover:text-sfs-blue"
                    >
                      {content.contact.email}
                    </a>
                  )}
                </div>

                <div className="sm:col-span-2">
                  <div className="text-xs font-bold uppercase tracking-wide text-slate-500">
                    {content.contact.addressLabel}
                  </div>
                  {editMode ? (
                    <textarea
                      rows={2}
                      value={draft.contact.address}
                      onChange={(e) =>
                        setDraft({ ...draft, contact: { ...draft.contact, address: e.target.value } })
                      }
                      className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-700 outline-none focus:ring-2 focus:ring-sfs-blue"
                    />
                  ) : (
                    <p className="mt-2 text-sm text-slate-700">{content.contact.address}</p>
                  )}
                </div>

                <div className="sm:col-span-2">
                  <div className="text-xs font-bold uppercase tracking-wide text-slate-500">
                    {content.contact.secondaryAddressLabel}
                  </div>
                  {editMode ? (
                    <textarea
                      rows={2}
                      value={draft.contact.secondaryAddress}
                      onChange={(e) =>
                        setDraft({
                          ...draft,
                          contact: { ...draft.contact, secondaryAddress: e.target.value },
                        })
                      }
                      className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-700 outline-none focus:ring-2 focus:ring-sfs-blue"
                    />
                  ) : (
                    <p className="mt-2 text-sm text-slate-700">{content.contact.secondaryAddress}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Help desk card */}
            <div className="md:col-span-2 rounded-xl border border-slate-200 bg-white p-6">
              <h3 className="text-lg font-extrabold text-sfs-ink">
                {content.contact.helpDeskTitle}
              </h3>
              <p className="mt-2 text-sm text-slate-600">
                Need help with access, payments, or certificates? Contact us and we’ll guide you.
              </p>
              <div className="mt-5 flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={handleSubmitTicket}
                  className="inline-flex items-center rounded-lg bg-sfs-blue px-4 py-2 text-sm font-semibold text-white hover:opacity-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-sfs-blue"
                >
                  {content.contact.submitTicketLabel}
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </div>
  );
}
