/* ============================================================
   Location Data — Hierarchical (Country → State → District → Mandal → Village/Town)
   Updated to latest bifurcated districts (AP: 26, Telangana: 33)
   ============================================================ */

const LocationData = (() => {

    // ─── Hierarchical data: Country → State → District → Mandal → Village ───
    const DATA = {
        'India': {
            'Andhra Pradesh': {
                // ── 26 Districts (post-2022 bifurcation) ──
                'Anakapalli': {
                    'Anakapalli': ['Anakapalli', 'Kasimkota', 'Munagapaka', 'Chodavaram', 'Butchayyapeta'],
                    'Atchutapuram': ['Atchutapuram', 'Elamanchili', 'Nakkapalli', 'Rambilli', 'Payakaraopeta'],
                    'Narsipatnam': ['Narsipatnam', 'Rolugunta', 'Makavarapalem', 'Golugonda', 'Madugula'],
                    'Sabbavaram': ['Sabbavaram', 'Cheedikada', 'Devarapalli', 'K. Kotapadu', 'Paravada'],
                },
                'Alluri Sitharama Raju': {
                    'Paderu': ['Paderu', 'Araku Valley', 'Chintapalli', 'Hukumpeta', 'Dumbriguda'],
                    'Ananthagiri': ['Ananthagiri', 'Koyyuru', 'Munchingiputtu', 'Pedabayalu'],
                    'Gudem Kotha Veedhi': ['Gudem Kotha Veedhi', 'Ganagaraju Madugula'],
                },
                'Anantapur': {
                    'Anantapur': ['Anantapur', 'Garladinne', 'Singanamala', 'Rapthadu'],
                    'Guntakal': ['Guntakal', 'Gooty', 'Pamidi', 'Uravakonda', 'Vajrakarur'],
                    'Tadpatri': ['Tadpatri', 'Peddavadugur', 'Yadiki', 'Settur'],
                    'Kalyanadurgam': ['Kalyanadurgam', 'Kambadur', 'Bommanahal'],
                },
                'Annamayya': {
                    'Rayachoti': ['Rayachoti', 'Sambepalli', 'Lakkireddipalli', 'Galiveedu', 'Ramapuram'],
                    'Madanapalle': ['Madanapalle', 'Nimmanapalle', 'Thamballapalle', 'Kurabalakota'],
                    'Pileru': ['Pileru', 'Kalikiri', 'Vayalpad', 'Gurramkonda', 'Kalakada'],
                },
                'Bapatla': {
                    'Bapatla': ['Bapatla', 'Karlapalem', 'Martur', 'Parchur', 'Yeddanapudi'],
                    'Chirala': ['Chirala', 'Vetapalem', 'Chinaganjam', 'Inkollu', 'Karamchedu'],
                    'Repalle': ['Repalle', 'Nagaram', 'Nizampatnam', 'Bhattiprolu', 'Cherukupalle'],
                },
                'Chittoor': {
                    'Chittoor': ['Chittoor', 'Gangadhara Nellore', 'Gudipala', 'Irala'],
                    'Palamaner': ['Palamaner', 'Kuppam', 'Ramakuppam', 'Baireddipalle'],
                    'Punganur': ['Punganur', 'Sodam', 'Palasamudram', 'Karvetinagaram'],
                    'Nagari': ['Nagari', 'Sathyavedu', 'Vijayapuram', 'Varadaiahpalem'],
                },
                'East Godavari': {
                    'Rajamahendravaram': ['Rajamahendravaram', 'Kadiam', 'Korukonda', 'Rajanagaram'],
                    'Peddapuram': ['Peddapuram', 'Samalkot', 'Jaggampeta', 'Gollaprolu'],
                    'Rampachodavaram': ['Rampachodavaram', 'Devipatnam', 'Gangavaram', 'Y.Ramavaram'],
                    'Tuni': ['Tuni', 'Prathipadu', 'Thondangi', 'Karapa'],
                },
                'Eluru': {
                    'Eluru': ['Eluru', 'Denduluru', 'Kaikalur', 'Chintalapudi'],
                    'Nuzvid': ['Nuzvid', 'Chatrai', 'Musunuru', 'Agiripalli'],
                    'Jangareddygudem': ['Jangareddygudem', 'Buttayagudem', 'Koyyalagudem', 'Jeelugu Milli'],
                },
                'Guntur': {
                    'Guntur': ['Guntur', 'Prathipadu', 'Pedakakani', 'Chebrolu'],
                    'Mangalagiri': ['Mangalagiri', 'Tadepalli', 'Thullur', 'Medikonduru'],
                    'Tenali': ['Tenali', 'Ponnur', 'Duggirala', 'Kollipara'],
                },
                'Kakinada': {
                    'Kakinada': ['Kakinada', 'Tallarevu', 'Karapa', 'Kajuluru'],
                    'Pithapuram': ['Pithapuram', 'Gollaprolu', 'Kirlampudi', 'U. Kothapalli'],
                    'Yeleswaram': ['Yeleswaram', 'Rowthulapudi', 'Tondangi'],
                },
                'Konaseema': {
                    'Amalapuram': ['Amalapuram', 'Mummidivaram', 'Razole', 'Kothapeta', 'Katrenikona'],
                    'Ramachandrapuram': ['Ramachandrapuram', 'K. Gangavaram', 'Ravulapalem'],
                    'Ambajipeta': ['Ambajipeta', 'Ainavilli', 'Alamuru', 'P. Gannavaram'],
                },
                'Krishna': {
                    'Machilipatnam': ['Machilipatnam', 'Gudivada', 'Pedana', 'Bantumilli'],
                    'Avanigadda': ['Avanigadda', 'Nagayalanka', 'Mopidevi', 'Challapalli'],
                    'Vuyyuru': ['Vuyyuru', 'Kalidindi', 'Pamarru', 'Movva'],
                },
                'Kurnool': {
                    'Kurnool': ['Kurnool', 'Orvakal', 'C. Belagal', 'Kodumur'],
                    'Adoni': ['Adoni', 'Holagunda', 'Yemmiganur', 'Mantralayam'],
                    'Pattikonda': ['Pattikonda', 'Aspari', 'Kosigi', 'Devanakonda'],
                },
                'Nandyal': {
                    'Nandyal': ['Nandyal', 'Mahanandi', 'Allagadda', 'Sirivella', 'Panyam'],
                    'Atmakur': ['Atmakur', 'Nandikotkur', 'Velugodu', 'Srisailam', 'Pagidyala'],
                    'Dhone': ['Dhone', 'Bethamcherla', 'Peapully', 'Banaganapalli'],
                    'Koilkuntla': ['Koilkuntla', 'Kolimigundla', 'Owk', 'Sanjamala'],
                },
                'NTR': {
                    'Vijayawada': ['Vijayawada', 'Kanuru', 'Benz Circle', 'Labbipet', 'Auto Nagar'],
                    'Nandigama': ['Nandigama', 'Jaggayyapeta', 'Kanchikacherla', 'Vatsavai'],
                    'Tiruvuru': ['Tiruvuru', 'Gampalagudem', 'Reddigudem', 'Vissannapeta'],
                    'Mylavaram': ['Mylavaram', 'Ibrahimpatnam', 'G. Konduru', 'A. Konduru'],
                },
                'Palnadu': {
                    'Narasaraopet': ['Narasaraopet', 'Chilakaluripeta', 'Vinukonda', 'Nuzendla'],
                    'Macherla': ['Macherla', 'Piduguralla', 'Gurazala', 'Karempudi', 'Dachepalle'],
                    'Sattenapalli': ['Sattenapalli', 'Amaravathi', 'Pedakurapadu', 'Krosuru', 'Bellamkonda'],
                },
                'Parvathipuram Manyam': {
                    'Parvathipuram': ['Parvathipuram', 'Salur', 'Bobbili', 'Rajam'],
                    'Palakonda': ['Palakonda', 'Kurupam', 'Seethampeta', 'Jiyammavalasa'],
                },
                'Prakasam': {
                    'Ongole': ['Ongole', 'Kandukur', 'Darsi', 'Markapur'],
                    'Giddalur': ['Giddalur', 'Cumbum', 'Podili', 'Yerragondapalem'],
                    'Addanki': ['Addanki', 'Santhamaguluru', 'Mundlamuru', 'Parchur'],
                },
                'Sri Potti Sriramulu Nellore': {
                    'Nellore': ['Nellore', 'Kavali', 'Atmakur', 'Podalakur'],
                    'Gudur': ['Gudur', 'Venkatagiri', 'Sullurpeta', 'Doravarisatram'],
                    'Kandukur': ['Kandukur', 'Udayagiri', 'Marripadu', 'Kovur'],
                },
                'Sri Sathya Sai': {
                    'Hindupur': ['Hindupur', 'Penukonda', 'Lepakshi', 'Gorantla', 'Somandepalle'],
                    'Kadiri': ['Kadiri', 'Gandlapenta', 'Nallacheruvu', 'Talupula', 'Tanakal'],
                    'Dharmavaram': ['Dharmavaram', 'Bathalapalle', 'Mudigubba', 'Kanaganapalle'],
                    'Madakasira': ['Madakasira', 'Gudibanda', 'Amarapuram', 'Agali'],
                    'Puttaparthi': ['Puttaparthi', 'Bukkapatnam', 'Nallamada', 'Kothacheruvu'],
                },
                'Srikakulam': {
                    'Srikakulam': ['Srikakulam', 'Gara', 'Etcherla', 'Amadalavalasa'],
                    'Palasa': ['Palasa', 'Kasibugga', 'Mandasa', 'Vajrapukotturu'],
                    'Tekkali': ['Tekkali', 'Ichchapuram', 'Kaviti', 'Sompeta'],
                    'Narasannapeta': ['Narasannapeta', 'Polaki', 'Santhabommali', 'Ranastalam'],
                },
                'Tirupati': {
                    'Tirupati': ['Tirupati', 'Tirumala', 'Chandragiri', 'Renigunta'],
                    'Srikalahasti': ['Srikalahasti', 'Yerpedu', 'Thottambedu', 'Satyavedu'],
                    'Sullurpeta': ['Sullurpeta', 'Tada', 'Doravarisatram', 'Naidupeta'],
                    'Kodur': ['Kodur', 'Rajampet', 'Nandalur', 'Pullampeta'],
                },
                'Visakhapatnam': {
                    'Visakhapatnam': ['Visakhapatnam', 'Seethammadhara', 'Dwaraka Nagar', 'MVP Colony'],
                    'Bheemunipatnam': ['Bheemunipatnam', 'Anandapuram', 'Padmanabham'],
                    'Gajuwaka': ['Gajuwaka', 'Pedagantyada', 'Malkapuram', 'Duvvada'],
                    'Pendurthi': ['Pendurthi', 'Kapuluppada', 'Chinagadili', 'Madhurawada'],
                },
                'Vizianagaram': {
                    'Vizianagaram': ['Vizianagaram', 'Denkada', 'Garividi', 'Gurla'],
                    'Nellimarla': ['Nellimarla', 'Cheepurupalli', 'Gajapathinagaram', 'Srungavarapukota'],
                    'Bhogapuram': ['Bhogapuram', 'Pusapatirega', 'Seethanagaram'],
                },
                'West Godavari': {
                    'Bhimavaram': ['Bhimavaram', 'Palacole', 'Narasapuram', 'Achanta'],
                    'Tadepalligudem': ['Tadepalligudem', 'Tanuku', 'Kovvur', 'Nidadavole'],
                    'Undi': ['Undi', 'Palakollu', 'Veeravasaram', 'Iragavaram'],
                },
                'YSR Kadapa': {
                    'Kadapa': ['Kadapa', 'Proddatur', 'Jammalamadugu', 'Mydukur'],
                    'Badvel': ['Badvel', 'Pulivendla', 'Kamalapuram', 'Rajupalem'],
                    'Rayachoti': ['Rayachoti', 'Rajampet', 'Chapadu', 'Porumamilla'],
                },
            },
            'Telangana': {
                // ── 33 Districts (post-2019) ──
                'Adilabad': {
                    'Adilabad': ['Adilabad', 'Bazarhathnoor', 'Bela', 'Jainath'],
                    'Mavala': ['Mavala', 'Gudihathnoor', 'Tamsi', 'Boath'],
                    'Ichoda': ['Ichoda', 'Indervelly', 'Narnoor', 'Talamadugu'],
                },
                'Bhadradri Kothagudem': {
                    'Kothagudem': ['Kothagudem', 'Palvancha', 'Bhadrachalam', 'Manuguru'],
                    'Yellandu': ['Yellandu', 'Sattupalli', 'Pinapaka', 'Chandrugonda'],
                    'Aswapuram': ['Aswapuram', 'Burgampad', 'Charla', 'Dummugudem'],
                },
                'Hanumakonda': {
                    'Hanamkonda': ['Hanamkonda', 'Inavolu', 'Darmaram', 'Elkathurthi'],
                    'Parkal': ['Parkal', 'Shayampet', 'Regonda', 'Atmakur'],
                    'Dornakal': ['Dornakal', 'Narsimhulapet', 'Wardhanapet'],
                },
                'Hyderabad': {
                    'Charminar': ['Charminar', 'Falaknuma', 'Shalibanda', 'Bahadurpura'],
                    'Secunderabad': ['Secunderabad', 'Trimulgherry', 'Begumpet', 'Tirumalagiri'],
                    'Khairatabad': ['Ameerpet', 'Punjagutta', 'Somajiguda', 'Jubilee Hills', 'Banjara Hills'],
                    'Kukatpally': ['Kukatpally', 'KPHB Colony', 'Miyapur', 'Chandanagar'],
                    'LB Nagar': ['LB Nagar', 'Dilsukhnagar', 'Nagole', 'Vanasthalipuram'],
                },
                'Jagtial': {
                    'Jagtial': ['Jagtial', 'Dharmapuri', 'Koratla', 'Raikal'],
                    'Metpally': ['Metpally', 'Beerpur', 'Gollapally', 'Mallial'],
                },
                'Jangaon': {
                    'Jangaon': ['Jangaon', 'Raghunathpally', 'Palakurthi', 'Station Ghanpur'],
                    'Lingala Ghanpur': ['Lingala Ghanpur', 'Zaffergadh', 'Bachannapeta'],
                },
                'Jayashankar Bhupalapally': {
                    'Bhupalapally': ['Bhupalapally', 'Palimela', 'Regonda', 'Chityal'],
                    'Kataram': ['Kataram', 'Malharrao', 'Tekumatla', 'Maha Mutharam'],
                },
                'Jogulamba Gadwal': {
                    'Gadwal': ['Gadwal', 'Alampur', 'Ieeja', 'Dharur'],
                    'Aija': ['Aija', 'Rajoli', 'Ghattu', 'Undavelli'],
                },
                'Kamareddy': {
                    'Kamareddy': ['Kamareddy', 'Bibipet', 'Banswada', 'Yellareddy'],
                    'Jukkal': ['Jukkal', 'Machareddy', 'Tadwai', 'Rajampet'],
                    'Domakonda': ['Domakonda', 'Sadasivanagar', 'Nasrullabad', 'Gandhari'],
                },
                'Karimnagar': {
                    'Karimnagar': ['Karimnagar', 'Huzurabad', 'Jammikunta', 'Manakondur'],
                    'Choppadandi': ['Choppadandi', 'Gangadhara', 'Thimmapur', 'Ramadugu'],
                    'Sircilla': ['Sircilla', 'Vemulawada', 'Yellareddipet', 'Boinpally'],
                },
                'Khammam': {
                    'Khammam': ['Khammam', 'Mudigonda', 'Thirumalayapalem', 'Wyra'],
                    'Madhira': ['Madhira', 'Yerrupalem', 'Penuballi', 'Nelakondapally'],
                    'Kusumanchi': ['Kusumanchi', 'Raghunadhapalem', 'Konijerla', 'Chintakani'],
                },
                'Kumuram Bheem Asifabad': {
                    'Asifabad': ['Asifabad', 'Kaghaznagar', 'Sirpur', 'Wankidi'],
                    'Rebbena': ['Rebbena', 'Gangapur', 'Tiryani', 'Penchikalpet', 'Dahegaon'],
                },
                'Mahabubabad': {
                    'Mahabubabad': ['Mahabubabad', 'Thorrur', 'Kesamudram', 'Nellikuduru'],
                    'Kuravi': ['Kuravi', 'Gudur', 'Garla', 'Chinna Guden'],
                },
                'Mahabubnagar': {
                    'Mahabubnagar': ['Mahabubnagar', 'Jadcherla', 'Koilkonda', 'Addakal'],
                    'Shadnagar': ['Shadnagar', 'Kalwakurthy', 'Farooqnagar', 'Nandigama'],
                },
                'Mancherial': {
                    'Mancherial': ['Mancherial', 'Bellampally', 'Mandamarri', 'Luxettipet'],
                    'Naspur': ['Naspur', 'Jannaram', 'Chennur', 'Dandepally'],
                },
                'Medak': {
                    'Medak': ['Medak', 'Narsapur', 'Haveli Ghanpur', 'Tekmal'],
                    'Siddipet': ['Siddipet', 'Dubbak', 'Gajwel', 'Husnabad'],
                },
                'Medchal Malkajgiri': {
                    'Medchal': ['Medchal', 'Kompally', 'Shamirpet', 'Dammaiguda'],
                    'Malkajgiri': ['Malkajgiri', 'Uppal', 'Alwal', 'Kapra'],
                    'Keesara': ['Keesara', 'Ghatkesar', 'Boduppal', 'Peerzadiguda'],
                },
                'Mulugu': {
                    'Mulugu': ['Mulugu', 'Govindaraopet', 'Eturnagaram', 'Venkatapuram'],
                    'Wazeed': ['Wazeed', 'Tadvai', 'Mangapet', 'Kannaigudem'],
                },
                'Nagarkurnool': {
                    'Nagarkurnool': ['Nagarkurnool', 'Achampet', 'Kalwakurthy', 'Kollapur'],
                    'Amrabad': ['Amrabad', 'Balmoor', 'Lingal', 'Padara'],
                },
                'Nalgonda': {
                    'Nalgonda': ['Nalgonda', 'Devarakonda', 'Nakrekal', 'Haliya'],
                    'Miryalaguda': ['Miryalaguda', 'Dameracherla', 'Tripuraram', 'Chandur'],
                },
                'Narayanpet': {
                    'Narayanpet': ['Narayanpet', 'Makthal', 'Utkoor', 'Narva'],
                    'Dhanwada': ['Dhanwada', 'Marikal', 'Kosgi', 'Damaragidda'],
                },
                'Nirmal': {
                    'Nirmal': ['Nirmal', 'Bhainsa', 'Mudhole', 'Dilawarpur'],
                    'Sarangapur': ['Sarangapur', 'Lokeswaram', 'Khanapur', 'Mamda'],
                },
                'Nizamabad': {
                    'Nizamabad': ['Nizamabad', 'Bodhan', 'Armoor', 'Dichpally'],
                    'Balkonda': ['Balkonda', 'Navipet', 'Varni', 'Yedapally'],
                },
                'Peddapalli': {
                    'Ramagundam': ['Ramagundam', 'Godavarikhani', 'Peddapalli', 'Manthani'],
                    'Sultanabad': ['Sultanabad', 'Julapally', 'Eligaid', 'Anthargaon'],
                },
                'Rajanna Sircilla': {
                    'Sircilla': ['Sircilla', 'Vemulawada', 'Yellareddipet', 'Boinpally'],
                    'Mustabad': ['Mustabad', 'Gambhiraopet', 'Ellanthakunta', 'Chandurthi'],
                },
                'Ranga Reddy': {
                    'Shamshabad': ['Shamshabad', 'Rajendranagar', 'Narsingi', 'Attapur'],
                    'Chevella': ['Chevella', 'Moinabad', 'Shankarpally', 'Gandipet'],
                    'Ibrahimpatnam': ['Ibrahimpatnam', 'Maheshwaram', 'Kandukur', 'Manchal'],
                },
                'Sangareddy': {
                    'Sangareddy': ['Sangareddy', 'Zaheerabad', 'Narayankhed', 'Andole'],
                    'Patancheru': ['Patancheru', 'Jogipet', 'Ameenpur', 'Ramachandrapuram'],
                },
                'Siddipet': {
                    'Siddipet': ['Siddipet', 'Gajwel', 'Husnabad', 'Dubbak'],
                    'Cheriyal': ['Cheriyal', 'Mirdoddi', 'Nanganur', 'Thoguta'],
                },
                'Suryapet': {
                    'Suryapet': ['Suryapet', 'Kodad', 'Huzurnagar', 'Mattampally'],
                    'Jangaon': ['Jangaon', 'Chilkur', 'Nagaram', 'Atmakur'],
                },
                'Vikarabad': {
                    'Vikarabad': ['Vikarabad', 'Pargi', 'Tandur', 'Kodangal'],
                    'Basheerabad': ['Basheerabad', 'Marpally', 'Nawabpet', 'Dharur'],
                },
                'Wanaparthy': {
                    'Wanaparthy': ['Wanaparthy', 'Srisailam', 'Gopalpet', 'Pangal'],
                    'Kothakota': ['Kothakota', 'Pebbair', 'Amarchinta', 'Gadwal'],
                },
                'Warangal': {
                    'Warangal': ['Warangal', 'Kazipet', 'Subedari', 'Bheemadevarapally'],
                    'Narsampet': ['Narsampet', 'Chennaraopet', 'Duggondi', 'Khanapur'],
                    'Parvathagiri': ['Parvathagiri', 'Sangem', 'Nekkonda', 'Geesugonda'],
                },
                'Yadadri Bhuvanagiri': {
                    'Bhongir': ['Bhongir', 'Ramannapet', 'Choutuppal', 'Bibinagar'],
                    'Alair': ['Alair', 'Mothkur', 'Yadagirigutta', 'Rajapet'],
                },
            },
            'Tamil Nadu': {
                'Chennai': {
                    'Egmore': ['Egmore', 'Nungambakkam', 'T.Nagar', 'Mylapore'],
                    'Tambaram': ['Tambaram', 'Chromepet', 'Pallavaram', 'Vandalur'],
                    'Ambattur': ['Ambattur', 'Anna Nagar', 'Mogappair', 'Avadi'],
                    'Velachery': ['Velachery', 'Adyar', 'Guindy', 'Sholinganallur'],
                },
                'Coimbatore': {
                    'Coimbatore North': ['RS Puram', 'Gandhipuram', 'Peelamedu', 'Singanallur'],
                    'Coimbatore South': ['Ukkadam', 'Podanur', 'Kinathukadavu', 'Pollachi'],
                    'Mettupalayam': ['Mettupalayam', 'Annur', 'Karamadai', 'Sulur'],
                },
                'Madurai': {
                    'Madurai': ['Madurai', 'Thirunagar', 'Goripalayam', 'Periyar Bus Stand'],
                    'Melur': ['Melur', 'Vadipatti', 'Usilampatti', 'Thirumangalam'],
                },
                'Salem': {
                    'Salem': ['Salem', 'Attur', 'Mettur', 'Edappadi'],
                    'Omalur': ['Omalur', 'Mecheri', 'Tharamangalam', 'Sangagiri'],
                },
                'Trichy': {
                    'Trichy': ['Trichy', 'Srirangam', 'Lalgudi', 'Musiri'],
                    'Manapparai': ['Manapparai', 'Thuraiyur', 'Manachanallur', 'Uppiliapuram'],
                },
            },
            'Karnataka': {
                'Bengaluru Urban': {
                    'Bengaluru North': ['Yelahanka', 'Hebbal', 'RT Nagar', 'Devanahalli'],
                    'Bengaluru South': ['Jayanagar', 'JP Nagar', 'Bannerghatta', 'Electronic City'],
                    'Bengaluru East': ['Whitefield', 'KR Puram', 'Mahadevapura', 'Marathahalli'],
                    'Bengaluru West': ['Rajajinagar', 'Vijayanagar', 'Basaveshwaranagar', 'Nagarbhavi'],
                },
                'Mysuru': {
                    'Mysuru': ['Mysuru', 'Nanjangud', 'T.Narasipura', 'Hunsur'],
                    'Mandya': ['Mandya', 'Maddur', 'Srirangapatna', 'Malavalli'],
                },
                'Hubli-Dharwad': {
                    'Hubli': ['Hubli', 'Keshwapur', 'Vidyanagar', 'Navanagar'],
                    'Dharwad': ['Dharwad', 'Alnavar', 'Navalgund', 'Kundgol'],
                },
            },
            'Maharashtra': {
                'Mumbai': {
                    'Mumbai City': ['Colaba', 'Fort', 'Dadar', 'Byculla', 'Worli'],
                    'Mumbai Suburban': ['Andheri', 'Borivali', 'Malad', 'Goregaon', 'Bandra'],
                    'Thane': ['Thane', 'Kalyan', 'Dombivli', 'Ulhasnagar', 'Bhiwandi'],
                },
                'Pune': {
                    'Pune City': ['Shivajinagar', 'Deccan', 'Kothrud', 'Hadapsar', 'Swargate'],
                    'Pimpri-Chinchwad': ['Pimpri', 'Chinchwad', 'Nigdi', 'Akurdi', 'Ravet'],
                    'Baramati': ['Baramati', 'Indapur', 'Daund', 'Jejuri'],
                },
                'Nagpur': {
                    'Nagpur': ['Nagpur', 'Kamptee', 'Hingna', 'Saoner', 'Ramtek'],
                },
            },
            'Kerala': {
                'Thiruvananthapuram': {
                    'Thiruvananthapuram': ['Thiruvananthapuram', 'Kazhakoottam', 'Neyyattinkara', 'Nedumangad'],
                    'Attingal': ['Attingal', 'Varkala', 'Chirayinkeezhu', 'Kilimanoor'],
                },
                'Kochi': {
                    'Kochi': ['Kochi', 'Aluva', 'Angamaly', 'Perumbavoor'],
                    'Muvattupuzha': ['Muvattupuzha', 'Kothamangalam', 'Piravom', 'Kolenchery'],
                },
                'Kozhikode': {
                    'Kozhikode': ['Kozhikode', 'Vadakara', 'Koyilandy', 'Feroke'],
                },
            },
            'West Bengal': {
                'Kolkata': {
                    'Kolkata': ['Kolkata', 'Salt Lake', 'New Town', 'Howrah', 'Dum Dum'],
                },
                'North 24 Parganas': {
                    'Barasat': ['Barasat', 'Barrackpore', 'Basirhat', 'Bongaon'],
                },
            },
            'Delhi': {
                'New Delhi': {
                    'New Delhi': ['Connaught Place', 'Karol Bagh', 'Saket', 'Dwarka', 'Rohini'],
                },
                'Central Delhi': {
                    'Central Delhi': ['Chandni Chowk', 'Daryaganj', 'Paharganj', 'Rajendra Place'],
                },
            },
            'Gujarat': {
                'Ahmedabad': {
                    'Ahmedabad': ['Ahmedabad', 'Maninagar', 'Naroda', 'Navrangpura', 'Satellite'],
                },
                'Surat': {
                    'Surat': ['Surat', 'Adajan', 'Varachha', 'Katargam', 'Udhna'],
                },
            },
            'Rajasthan': {
                'Jaipur': {
                    'Jaipur': ['Jaipur', 'Sanganer', 'Amer', 'Chomu', 'Shahpura'],
                },
                'Jodhpur': {
                    'Jodhpur': ['Jodhpur', 'Pali', 'Barmer', 'Jaisalmer'],
                },
            },
            'Uttar Pradesh': {
                'Lucknow': {
                    'Lucknow': ['Lucknow', 'Hazratganj', 'Aminabad', 'Gomti Nagar', 'Aliganj'],
                },
                'Varanasi': {
                    'Varanasi': ['Varanasi', 'Sarnath', 'Ramnagar', 'Chandauli'],
                },
                'Noida': {
                    'Noida': ['Noida', 'Greater Noida', 'Dadri', 'Dankaur'],
                },
            },
        },
        'United States': {
            'California': {
                'Los Angeles': {
                    'Los Angeles': ['Hollywood', 'Beverly Hills', 'Santa Monica', 'Pasadena'],
                },
                'San Francisco': {
                    'San Francisco': ['Downtown', 'Mission District', 'SoMa', 'Marina'],
                },
            },
            'New York': {
                'New York City': {
                    'Manhattan': ['Midtown', 'Harlem', 'SoHo', 'Tribeca'],
                    'Brooklyn': ['Williamsburg', 'Park Slope', 'DUMBO', 'Bushwick'],
                },
            },
            'Texas': {
                'Dallas': {
                    'Dallas': ['Downtown', 'Uptown', 'Deep Ellum', 'Oak Lawn'],
                },
                'Houston': {
                    'Houston': ['Downtown', 'Midtown', 'Heights', 'Montrose'],
                },
            },
        },
        'United Kingdom': {
            'England': {
                'London': {
                    'Westminster': ['Westminster', 'Mayfair', 'Soho', 'Covent Garden'],
                    'Camden': ['Camden Town', 'Hampstead', 'Kings Cross', 'Bloomsbury'],
                },
                'Manchester': {
                    'Manchester': ['City Centre', 'Didsbury', 'Chorlton', 'Salford'],
                },
            },
        },
    };

    function getCountries() {
        return Object.keys(DATA).sort();
    }

    function getStates(country) {
        if (!country || !DATA[country]) return [];
        return Object.keys(DATA[country]).sort();
    }

    function getDistricts(country, state) {
        if (!country || !state || !DATA[country] || !DATA[country][state]) return [];
        return Object.keys(DATA[country][state]).sort();
    }

    function getMandals(country, state, district) {
        if (!country || !state || !district) return [];
        const stateData = DATA[country]?.[state];
        if (!stateData || !stateData[district]) return [];
        return Object.keys(stateData[district]).sort();
    }

    function getVillages(country, state, district, mandal) {
        if (!country || !state || !district || !mandal) return [];
        const villages = DATA[country]?.[state]?.[district]?.[mandal];
        if (!Array.isArray(villages)) return [];
        return [...villages].sort();
    }

    return { getCountries, getStates, getDistricts, getMandals, getVillages };
})();
