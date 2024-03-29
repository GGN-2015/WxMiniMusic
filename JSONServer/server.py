from http.server import HTTPServer, BaseHTTPRequestHandler
import json
import random

def loadDB(filename: str):
    return json.load(open(filename, 'r', encoding='utf-8'))

def saveDB(mem: dict, filename: str):
    json.dump(mem, open(filename, 'w', encoding='utf-8'), indent=4, ensure_ascii=False)

host_ip = '0.0.0.0'
host = (host_ip, 1200)
IMG_IP = "127.0.0.1" # TODO: 这里最终要改成 127.0.0.1
IMG_PORT = 8000 # 对象服务器接口

def SafeGet(x, key):
    if x.get(key) is None:
        return "UnDefined"
    else:
        return x[key]
    
def IntWrap(cnt):
    if cnt is None:
        cnt = 3
    else:
        cnt = int(cnt)
    return cnt

def getMusicRank(cnt):
    cnt = IntWrap(cnt)
    mem = loadDB('music.json')
    
    tmp = []
    for x in mem: # 枚举所有音乐
        tmp.append((SafeGet(x, 'name'), SafeGet(x, 'play'), SafeGet(x, 'composer'), SafeGet(x, 'image')))
    tmp.sort(key=lambda x:-x[1])

    ans = []
    for x in tmp:
        ans.append({
            'name': x[0],
            'play': x[1],
            'composer': x[2],
            'image': ImageWrap(x[3])
        })

    return {
        "result": ans[:cnt]
    }

def StrLike(s1: str, s2: str): # 字符串相似
    return s1.strip() == s2.strip()

def ImageWrap(s: str):
    if s[:4] == "http":
        return s
    else:
        return "http://" + IMG_IP + ":" + str(IMG_PORT) + "/" + s

def getMusicShortInfo(name: str):
    mem = loadDB('music.json')
    data = {
        'result': {
            'found': False,
            'name': "MusicName",
            'image': "pic/Test.jpg",
            'composer': "ComposerName"
        }
    }
    for x in mem:
        if StrLike(SafeGet(x, 'name'), name):
            data = {
                'result': {
                    'found': True,
                    'name': SafeGet(x, 'name'),
                    'image': ImageWrap(SafeGet(x, 'image')),
                    'composer': SafeGet(x, 'composer')
                }
            }
            break
    return data

def getCategoryMusicCount(name):
    mem = loadDB('music.json')
    cnt = 0
    for x in mem:
        if name in SafeGet(x, 'category'):
            cnt += 1
    return cnt

def getCategory(cnt: int):
    # cnt = IntWrap(cnt)
    
    mem = loadDB('category.json')
    data = []
    for x in mem:
        data.append({
            'name': SafeGet(x, 'name'),
            'image': ImageWrap(SafeGet(x, 'image')),
            'count': getCategoryMusicCount(SafeGet(x, 'name'))
        })
    return {
        'result': data[:cnt]
    }

def getComposerType(cnt: int):
    cnt = IntWrap(cnt)

    mem = loadDB('composerType.json')
    data = []
    for x in mem:
        data.append({
            'name': SafeGet(x, 'name'),
            'image': ImageWrap(SafeGet(x, 'image')),
        })
    return {
        'result': data[:cnt]
    }

def getMusicInCategory(name, cnt):
    cnt = IntWrap(cnt)

    ans = []
    mem = loadDB('music.json')
    for x in mem:
        if str(name) in SafeGet(x, 'category'):
            ans.append({
                'name': SafeGet(x, "name"),
                'image': ImageWrap(SafeGet(x, "image")),
                'composer': SafeGet(x, "composer")
            })
    return {
        "result": ans
    }

def MusicMatch(musicObj, match) -> bool:
    ans = False
    if match is None:
        return False

    if SafeGet(musicObj, 'name').find(match) != -1:
        ans = True
    elif match in SafeGet(musicObj, 'category'):
        ans = True
    elif SafeGet(musicObj, 'composer').find(match) != -1:
        ans = True

    return ans

def isComposer(match):
    mem = loadDB('composer.json')
    if mem.get(match) is not None:
        return True
    return False

def getComposerMessage(match):
    mem = loadDB('composer.json')
    return mem[match]

def getMusicSearch(match, cnt):
    # cnt = IntWrap(cnt)
    mem = loadDB("music.json")
    ans = []
    for x in mem:
        if MusicMatch(x, match):
            ans.append({
                'name': SafeGet(x, 'name'),
                'composer': SafeGet(x, 'composer'),
                'image': ImageWrap(SafeGet(x, 'image'))
            })
    data = {
        'result': ans,
        'attach': None
    }
    if isComposer(match):
        data['attach'] = getComposerMessage(match)
        data['attach']['image'] = ImageWrap(data['attach']['image'])
    return data

def getCollection(nickname, cnt):
    cnt = IntWrap(cnt)

    if nickname is None:
        return {
            "result": []
        }

    mem = loadDB("user.json")
    if mem.get(nickname) is None:
        mem[nickname] = {
            "Collection" : []
        }
        saveDB(mem, 'user.json')
    
    songs = mem[nickname]["Collection"]
    arr = []

    mem = loadDB('music.json')
    for x in mem:
        if SafeGet(x, 'name') in songs:
            arr.append({
                'name': x.get('name'),
                'image': ImageWrap(x.get('image')),
                'composer': x.get('composer')
            })

    print(songs)
    return {
        'result': arr
    }

def makeUnFollow(nickName, name):
    mem = loadDB("user.json")
    if mem.get(nickName) is not None:
        newCollection = []

        for x in mem[nickName]['Collection']:
            if x != name:
                newCollection.append(x)
        
        mem[nickName]['Collection'] = newCollection
        saveDB(mem, 'user.json')

def CopyData(obj: str):
    if type(obj) == list:
        arr = []
        for x in obj:
            arr.append(CopyData(x))
        return arr
    elif type(obj) == dict:
        arr = {}
        for x in obj:
            arr[CopyData(x)] = CopyData(obj[x])
        return arr
    else:
        return obj

def MusicInfoDetail(name):
    data = None

    mem = loadDB('music.json')
    for x in mem:
        if SafeGet(x, 'name') == name:
            data = CopyData(x)
            data["image"] = ImageWrap(x["image"])
            data["source"] = ImageWrap(x["source"])
            x["play"] += 1 # 播放数 += 1

    saveDB(mem, 'music.json')
    return {
        'found': True if data is not None else False,
        'result': data
    }

def setFollow(nickName, name):
    if nickName is None or name is None:
        return
    mem = loadDB('user.json')
    
    if mem.get(nickName) is None:
        mem[nickName] = {
            "Collection": []
        }
    
    if name not in mem[nickName]['Collection']:
        mem[nickName]['Collection'].append(name)
        saveDB(mem, 'user.json')

def getRandomMotto():
    mem = loadDB('motto.json')
    idx = random.randint(0, len(mem) - 1)
    return {
        "result": mem[idx]
    }

def getComposerImageByName(name):
    mem = loadDB('composer.json')
    if mem.get(name) is None:
        return 'pic/error.png'
    else:
        return mem[name]['image']

def getComposerTypeDetail(name):
    mem = loadDB("composerType.json")
    for x in mem:
        if x.get('name') == name:
            data = {
                'result': []
            }
            for composer in x.get('composer'):
                data['result'].append({
                    'image': ImageWrap(getComposerImageByName(composer)),
                    'name': composer
                })
            return data
    return {
        "result": []
    }

def saveFeedBack(nickName, content):
    mem = loadDB("feedback.json")
    mem.append({
        "nickName": nickName,
        "content": content
    })
    saveDB(mem, "feedback.json")
    return {
        'result': "反馈成功"
    }

def getDataByInput(inputData): # 根据输入获取数据    
    data = {'result' : 'type unknown.'}

    if inputData.get("type") == "MusicRank":
        data = getMusicRank(inputData.get('count')) # OK

    elif inputData.get("type") == "MusicShortInfo":
        data = getMusicShortInfo(inputData.get('name')) # OK
        
    elif inputData.get("type") == "Category":
        data = getCategory(inputData.get("count")) # OK
        
    elif inputData.get("type") == "ComposerType":
        data = getComposerType(inputData.get("count")) # OK
    
    elif inputData.get("type") == "MusicInCategory": # 获取某一音乐分类中的所有音乐
        data = getMusicInCategory(inputData.get("name"), inputData.get("count")) # OK

    elif inputData.get("type") == "MusicSearch":
        data = getMusicSearch(inputData.get("match"), inputData.get("count")) # OK
    
    elif inputData.get("type") == "Collection":
        data = getCollection(inputData.get("nickName"), inputData.get("count"))
    
    elif inputData.get("type") == "UnFollow":
        makeUnFollow(inputData.get("nickName"), inputData.get("name"))
        data = getCollection(inputData.get("nickName"), inputData.get("count"))

    elif inputData.get("type") == "MusicInfoDetail":
        data = MusicInfoDetail(inputData.get('name'))

    elif inputData.get("type") == "SetFollow":
        setFollow(inputData.get("nickName"), inputData.get("name"))
        data = getCollection(inputData.get("nickName"), inputData.get("count"))
    
    elif inputData.get("type") == "GetRandomMotto": # 获取随机名言
        data = getRandomMotto()

    elif inputData.get("type") == "ComposerTypeDetail":
        data = getComposerTypeDetail(inputData.get("name"))

    elif inputData.get("type") == "FeedBack":
        data = saveFeedBack(inputData.get("nickName"), inputData.get("content"))
    
    print("return data", data)
    data['echo'] = inputData
    return data
 
class Resquest(BaseHTTPRequestHandler):
    def do_POST(self):

        if self.headers.get('content-length') is not None:
            datas = self.rfile.read(int(self.headers['content-length']))
            inputData = json.loads(datas.decode())
        else:
            inputData = {}
        print(inputData)

        data = getDataByInput(inputData)

        self.send_response(200)
        self.send_header('Content-type', 'application/json')
        self.end_headers()
        self.wfile.write(json.dumps(data).encode())
    
    def do_GET(self):
        self.do_POST()
 
if __name__ == '__main__':
    server = HTTPServer(host, Resquest)
    print("Starting server, listen at: %s:%s" % host)
    server.serve_forever()
