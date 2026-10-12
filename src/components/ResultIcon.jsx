// Result badge for finish screens: perfect/good = check, study = book.
export default function ResultIcon({ tone, size = 'md' }) {
  const styles = {
    perfect: 'bg-green-100 text-green-600',
    good: 'bg-indigo-100 text-indigo-600',
    study: 'bg-amber-100 text-amber-600',
  }
  return (
    <div className={`${size === 'lg' ? 'w-20 h-20 rounded-3xl mb-6' : 'w-14 h-14 rounded-2xl mb-4'} flex items-center justify-center mx-auto ${styles[tone]}`}>
      <svg className={size === 'lg' ? 'w-10 h-10' : 'w-7 h-7'} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden>
        {tone === 'study'
          ? <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          : <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />}
      </svg>
    </div>
  )
}
