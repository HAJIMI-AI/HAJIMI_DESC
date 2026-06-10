import { useEffect, useRef, useState, useCallback } from 'react'

interface UseInViewOptions {
  threshold?: number
  rootMargin?: string
  triggerOnce?: boolean
}

export function useInView({
  threshold = 0.15,
  rootMargin = '0px 0px -50px 0px',
  triggerOnce = true,
}: UseInViewOptions = {}) {
  const ref = useRef<HTMLDivElement>(null)
  const [inView, setInView] = useState(false)

  const observerCallback = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const [entry] = entries
      if (entry.isIntersecting) {
        setInView(true)
        if (triggerOnce && ref.current) {
          observerRef.current?.unobserve(ref.current)
        }
      } else if (!triggerOnce) {
        setInView(false)
      }
    },
    [triggerOnce]
  )

  const observerRef = useRef<IntersectionObserver | null>(null)

  useEffect(() => {
    observerRef.current = new IntersectionObserver(observerCallback, {
      threshold,
      rootMargin,
    })

    const node = ref.current
    if (node) {
      observerRef.current.observe(node)
    }

    return () => {
      if (node) {
        observerRef.current?.unobserve(node)
      }
    }
  }, [threshold, rootMargin, observerCallback])

  return { ref, inView }
}
