import markdownToHtml from '@/utils/markdownToHtml'
import type { Message } from 'ai/react'
import { useMemo } from 'react'
import React, { useState } from 'react'
import Image from 'next/image'

export function ChatMessageBubble(props: {
  message: Message
  aiEmoji?: string
  sources: any[]
}) {
  const colorClassName =
    props.message.role === 'user'
      ? 'bg-primary-user mb-4'
      : 'bg-primary-system mb-2'
  const alignmentClassName =
    props.message.role === 'user' ? 'ml-auto' : 'mr-auto'
  const prefix = props.message.role === 'user' ? '🧑' : props.aiEmoji
  const shareClassName =
    props.message.role === 'user' ? 'share-none' : 'share-show'

  const content = useMemo(() => {
    return markdownToHtml(props.message.content)
  }, [props.message.content])

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [apiData, setApiData] = useState('')
  const [submitLoading, setSubmitLoading] = useState(false)

  const fetchData = async () => {
    try {
      setIsLoading(true)
      // const response = await fetch('/api/text');
      // const data = await response.text();

      const data =
        'In our fast-paced world, it’s easy to overlook the significance of small, consistent actions. However, it’s often these tiny habits that lead to profound changes over time. Whether it’s reading a few pages of a book each day, taking a short walk, or practicing gratitude, small habits can compound into remarkable results.'

      setApiData(data)
      setIsModalOpen(true)
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = async () => {
    try {
      setSubmitLoading(true)
      await fetch('/api/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ data: apiData }),
      })
      setIsModalOpen(false)
    } catch (error) {
      console.error('Error submitting data:', error)
    } finally {
      setSubmitLoading(false)
    }
  }

  const handleClose = async () => {
    setIsModalOpen(false)
  }

  return (
    <div className="flex flex-wrap">
      <div className={`${shareClassName} show-img flex`}>
        <Image src="/logo.png" alt="Logo" width={32} height={32} />
      </div>
      <div
        className={`${alignmentClassName} ${colorClassName} rounded px-4 py-2 max-w-[80%] flex`}
      >
        {/* <div className="mr-2">{prefix}</div> */}
        {/* whitespace-pre-wrap  */}
        <div className="flex flex-col">
          <div
            className="prose prose-lg max-w-none"
            dangerouslySetInnerHTML={{ __html: content }}
          ></div>
          {props.sources && props.sources.length ? (
            <>
              <code className="mt-4 mr-auto bg-slate-600 px-2 py-1 rounded">
                <h2>🔍 Sources:</h2>
              </code>
              <code className="mt-1 mr-2 bg-slate-600 px-2 py-1 rounded text-xs">
                {props.sources?.map((source, i) => (
                  <div className="mt-2" key={'source:' + i}>
                    {i + 1}. &quot;{source.pageContent}&quot;
                    {source.metadata?.loc?.lines !== undefined ? (
                      <div>
                        <br />
                        Lines {source.metadata?.loc?.lines?.from} to{' '}
                        {source.metadata?.loc?.lines?.to}
                      </div>
                    ) : (
                      ''
                    )}
                  </div>
                ))}
              </code>
            </>
          ) : (
            ''
          )}
        </div>
      </div>
      <div className={`${shareClassName} w-100 mb-2`}>
        <div className="flex items-center share-icon" onClick={fetchData}>
          <svg
            className="icon mr-2"
            viewBox="0 0 1024 1024"
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            p-id="2291"
            width="24"
            height="24"
          >
            <path
              d="M731.554909 410.205091c0-5.166545-0.093091-10.286545-0.325818-15.36 22.109091-16.477091 41.285818-37.096727 56.459636-60.695273-20.293818 9.122909-42.077091 15.220364-64.977455 17.780364 23.365818-14.382545 41.285818-37.376 49.757091-64.977455-21.876364 13.265455-46.08 22.760727-71.819636 27.694545-20.619636-23.458909-50.036364-38.4-82.571636-38.958545-62.464-1.024-113.105455 51.758545-113.105455 117.899636 0 9.402182 0.977455 18.525091 2.932364 27.322182C413.835636 414.859636 330.472727 365.893818 274.711273 292.072727c-9.728 17.687273-15.313455 38.353455-15.313455 60.509091 0 41.890909 19.968 79.127273 50.315636 101.096727C291.141818 452.840727 273.733818 447.208727 258.466909 437.992727c0 0.512 0 1.024 0 1.536 0 58.554182 39.005091 107.613091 90.763636 119.063273-9.495273 2.699636-19.502545 4.096-29.789091 4.049455-7.307636-0.046545-14.382545-0.837818-21.271273-2.327273 14.382545 47.988364 56.180364 83.037091 105.658182 84.200727-38.725818 32.116364-87.505455 51.293091-140.474182 51.153455-9.122909 0-18.152727-0.605091-26.996364-1.722182 50.082909 34.350545 109.521455 54.365091 173.428364 54.365091C617.797818 748.357818 731.554909 567.296 731.554909 410.205091z"
              p-id="2292"
              fill="#ea4672"
            ></path>
            <path
              d="M1024 512c0-282.763636-229.236364-512-512-512S0 229.236364 0 512s229.236364 512 512 512S1024 794.763636 1024 512zM46.545455 512C46.545455 254.929455 254.929455 46.545455 512 46.545455c257.070545 0 465.454545 208.384 465.454545 465.454545 0 257.070545-208.384 465.454545-465.454545 465.454545C254.929455 977.454545 46.545455 769.070545 46.545455 512z"
              p-id="2293"
              fill="#ea4672"
            ></path>
          </svg>
        </div>
      </div>

      {isModalOpen && (
        <div className="modal-share">
          <div className="modal-share-content">
            <p className="pt-2">{apiData}</p>
            <div className="flex items-center justify-center mt-8">
              <button className="btn-close" onClick={handleClose}>
                Close
              </button>
              <button
                className="ml-2"
                onClick={handleSubmit}
                disabled={submitLoading}
              >
                {submitLoading ? 'Loading...' : 'Send'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
