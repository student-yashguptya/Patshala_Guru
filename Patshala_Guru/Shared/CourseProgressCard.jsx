import { View, Text, Image } from 'react-native'
import Colors from '../constants/Colors'
import { imageAssets } from '../constants/Option'
import * as Progress from 'react-native-progress';


export default function CourseProgressCard({item,width=280}) {
    const GetCompletedChapters=(course)=>{
    const completedChapter=course?.completedChapter?.length;
    const perc=completedChapter/course?.chapters?.length;
    return perc 
  }
  return (
   <View
            style={{
                margin:6,
                padding:15,
                backgroundColor:Colors.bg_gray,
                borderRadius:15,
                width:width
            }}
            >
                <View 
                style={{
                    display:'flex',
                    flexDirection:'row',
                    gap:5
                }}
                >
                <Image
                source={imageAssets[item.banner_image] || imageAssets['/banner1.png']}
                style={{ width:100, height: 100, borderRadius: 15 }}
                resizeMode="cover"
                />
                
            <View
            style={{flex:1}}
            >
                <Text numberOfLines={2} style={{ fontSize: 18, fontFamily: 'Outfit-Bold', flexWrap:'wrap', }}>{item?.courseTitle}</Text>
                <Text style={{ fontFamily: 'Outfit-SemiBold' }}>{item?.chapters?.length} {item?.chapters?.length === 1 ? 'Chapter' : 'Chapters'}</Text>
            </View>

                </View>
                <View
                style={{
                  marginTop:10
                }}
                >
                   <Progress.Bar
                   progress={GetCompletedChapters(item)}
                   width={width === '100%' ? null : 250} // auto-width when full width
                   style={{ alignSelf: 'stretch' }}
                   />

                    <Text style={{fontFamily:"Outfit-SemiBold"}}>{item?.completedChapter?.length} Out of {item?.chapters?.length} Chapter Completed</Text>
                </View>
            </View>
  )
}