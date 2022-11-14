import boto3

from boto3.dynamodb.conditions import Key

def lambda_handler(event, context):
  try:
    dynamoDB = boto3.resource("dynamodb")
    table = dynamoDB.Table("table-name") # DynamoDBのテーブル名

    # DynamoDBへのquery処理実行
    queryData = table.query(
      KeyConditionExpression = Key("your-partition-key").eq("your-partition-key-data") & Key("your-sort-key").eq("your-sort-key-data"), # 取得するKey情報
      ScanIndexForward = False, # 昇順か降順か(デフォルトはTrue=昇順)
      Limit = 1 # 取得するデータ件数
    )
    return queryData
  except Exception as e:
        print e
        
client=boto3.client('location')

response=client.search_place_index_for_text(
    BiasPosition=[
        123.0, #指定した位置に最も近い結果を検索する。緯度と経度で定義されるオプションのパラメータ 最初のバイアス位置はX座標、つまり経度 2番目のバイアス位置はY座標(緯度)
    ],
    FilterBBox=[
        123.0, #指定された境界ボックス内のPlacesのみを返すことで、結果をフィルター処理する 最初のbboxの位置は、下南西角のX座標または経度 2 番目のbboxの位置は、下南西角のY座標または緯度
    ],
    FilterCountries=[
        'string', #検索対象の国/地域のリストを指定(省略可能)
    ],
    IndexName='string', #検索に使用する場所インデックスリソースの名前
    MaxResults=123, #要求ごとに返される結果の最大数(省略可能)
    Text='string' #検索に使用する住所、名前、市区町村、又は地域、自由形式のテキスト形式
)