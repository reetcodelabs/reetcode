import { http, HttpResponse } from 'msw'

import { sleep } from '../utils/sleep'

export const mockTreePaths = [
  {
    path: '.changeset',
    type: 'tree',
    sha: '5df7198c8cdd61ed901983bb201282a424490751',
  },
  {
    path: '.eslintignore',
    type: 'blob',
    sha: '28af48ab6db00f57fde38ffdf783a39029362ee7',
  },
  {
    path: '.eslintrc.js',
    type: 'blob',
    sha: '559d5f480ef269b8c141a669e18c81bee6be77bb',
  },
  {
    path: '.gitattributes',
    type: 'blob',
    sha: 'e5a4d904e4f9c40ac936cececa1c2ddb87a2cba3',
  },
  {
    path: '.github',
    type: 'tree',
    sha: '15941ec2aedc187ede8b28a2f5589c38a104056b',
  },
  {
    path: '.husky',
    type: 'tree',
    sha: 'b622ade7252cf33efd1b9b7f7233d32d1fc6036e',
  },
  {
    path: '.prettierrc',
    type: 'blob',
    sha: '3718cf898655b5d9d6a24a696172dc9a5782927a',
  },
  {
    path: '.vale.ini',
    type: 'blob',
    sha: '7def440957fec759f9b27b2457fe01a719eafa90',
  },
  {
    path: '.vscode',
    type: 'tree',
    sha: '0274a81f8ee9ca3669295dc40f510bd2021d0043',
  },
  {
    path: '.yarn',
    type: 'tree',
    sha: 'b3ef64f9c7782412fc867f18250d322c6093d0a5',
  },
  {
    path: '.yarnrc.yml',
    type: 'blob',
    sha: 'b8a66c9613b83cb3f7b9b00837221ae81235c560',
  },
  {
    path: 'CHANGELOG.md',
    type: 'blob',
    sha: '2015bf8a1133f30c7baaeab1f7bd823eee7e8f92',
  },
  {
    path: 'CODEOWNERS',
    type: 'blob',
    sha: '147a4b7e2b6f912aee8fc2be5571850120e22462',
  },
  {
    path: 'CONTRIBUTING.md',
    type: 'blob',
    sha: 'bf0bbd269bdfc572999b92a64319aedc9b540dd6',
  },
  {
    path: 'LICENSE',
    type: 'blob',
    sha: 'b09b7e97d438e169bb977697d6b85ea3b07be76b',
  },
  {
    path: 'README.md',
    type: 'blob',
    sha: '86cad7521387267979704c8fde912831de84631b',
  },
  {
    path: 'SECURITY.md',
    type: 'blob',
    sha: 'be51b12006580c25e2d7ca5cb938e5f1d35bb374',
  },
  {
    path: 'integration-tests',
    type: 'tree',
    sha: 'b801898cb1a0f21c4a72380f028c1fc95f53a115',
  },
  {
    path: 'jest.config.js',
    type: 'blob',
    sha: '8e1beec8e0282ee489de0b54a96ecb91a00d7a04',
  },
  {
    path: 'package.json',
    type: 'blob',
    sha: '0bde02e7708e7bc57147ba0bc98cc7b400a86f20',
  },
  {
    path: 'packages',
    type: 'tree',
    sha: '08bf7c976c1ad366eebd16ecf6ba606b68dc6b1f',
  },
  {
    path: 'scripts',
    type: 'tree',
    sha: 'c0a88cca342cd08584bb586f493ca1877ca2aa85',
  },
  {
    path: 'turbo.json',
    type: 'blob',
    sha: '2a6bccb5d0ae52d00d35ba8e210848b6e49ddfdf',
  },
  {
    path: 'www',
    type: 'tree',
    sha: '1e51586aa7bd351231bfd870f664aad3a05a8ac3',
  },
  {
    path: 'yarn.lock',
    type: 'blob',
    sha: 'b90818d6830016cf4578756b60c0003a5677c908',
  },
]

export const packagesTreePaths = [
  {
    path: 'packages/admin-next',
    type: 'tree',
    sha: '1ed43e5fde22e53d020bd3f9a8073452f2a93d93',
  },
  {
    path: 'packages/cli',
    type: 'tree',
    sha: '3f28cde446533c9aec5e834555203ace1d2cce40',
  },
  {
    path: 'packages/core',
    type: 'tree',
    sha: 'a27264a8322fa5e90631b6f5e4064142a8222856',
  },
  {
    path: 'packages/design-system',
    type: 'tree',
    sha: '8c6285613bc2e6a49d5b4adac3ddf1be655a2898',
  },
  {
    path: 'packages/medusa-telemetry',
    type: 'tree',
    sha: 'ca0c10bdebb9a586a9245ff4deccf6fe0a0ad5e0',
  },
  {
    path: 'packages/medusa',
    type: 'tree',
    sha: '5cdf0cfd6db5b73567c2d500727b497597fd6619',
  },
  {
    path: 'packages/modules',
    type: 'tree',
    sha: 'c4f2836847952e687b39750674d0612a08d1c7d2',
  },
]

export const packagesCliTreePaths = [
  {
    path: 'packages/cli/create-medusa-app',
    type: 'tree',
    sha: '3aadb555e34bc3bda9e426f2788dcfae5729dc42',
  },
  {
    path: 'packages/cli/medusa-cli',
    type: 'tree',
    sha: '3c240dd538616efd5be55736f9c1beda31a7af36',
  },
  {
    path: 'packages/cli/medusa-dev-cli',
    type: 'tree',
    sha: 'f8b46cbbf5bc27966789ac07378c8b75351f61ef',
  },
  {
    path: 'packages/cli/oas',
    type: 'tree',
    sha: '8373897d5b65d7dd17cd01e24acbd9f63b0d7def',
  },
]

export const handlers = [
  http.get('http://localhost:4000/api/docs_list', async () => {
    const data = [
      { name: 'Vite', url: 'https://vitejs.dev/' },
      { name: 'Redux Style Guide', url: 'https://redux.js.org/style-guide/' },
      { name: 'Redux Toolkit', url: 'https://redux-toolkit.js.org/' },
      {
        name: 'RTK Query API Reference',
        url: 'https://redux-toolkit.js.org/rtk-query/api/createApi',
      },
      { name: 'Vitest', url: 'https://vitest.dev/' },
      { name: 'MSW', url: 'https://mswjs.io/' },
      { name: 'Tailwind CSS', url: 'https://tailwindcss.com/' },
      {
        name: 'CSS Nesting',
        url: 'https://developer.chrome.com/articles/css-nesting/',
      },
      {
        name: 'CSS Modules',
        url: 'https://github.com/css-modules/css-modules',
      },
    ]
    await sleep(3000)

    return HttpResponse.json(data)
  }),
  http.get(
    'https://problems.reetcode.com/github-file-tree-load-on-interaction/optimized',
    async ({ request }) => {
      const url = new URL(request.url)
      const path = url.searchParams.get('path')

      await sleep(50)

      if (!path) {
        return HttpResponse.json(mockTreePaths)
      }

      if (path === 'packages') {
        return HttpResponse.json(packagesTreePaths)
      }

      if (path === 'packages/cli') {
        return HttpResponse.json(packagesCliTreePaths)
      }

      return HttpResponse.json(mockTreePaths)
    },
  ),
]
